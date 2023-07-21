import multer from "@koa/multer"
import Router from "@koa/router"
import { createReadStream } from "fs"
import { mkdir, readdir, rm, stat, writeFile } from "fs/promises"
import Koa from "koa"
import { dirname, join, normalize, resolve } from "path"
import { cwd } from "process"
import { createLink, getToken, resolveLink } from "./db.js"

const bucketDir = join(cwd(), "buckets")
await mkdir(bucketDir, { recursive: true })

const token = await getToken()

console.info(`Your authenticaten token is: ${token}`)
console.info(`Buckets: ${bucketDir}`)

const app = new Koa()
const router = new Router()
const upload = multer()

router.get("/shared/:id", async ctx => {
	const { filePath } = await resolveLink(ctx.params.id)

	const stats = await stat(filePath)

	if (stats.isFile()) {
		ctx.attachment(filePath)
		ctx.status = 200
		ctx.body = createReadStream(filePath)
	} else {
		ctx.status = 404
	}
})

// Auth check
router.use(async (ctx, next) => {
	let providedToken = ctx.request.headers.authorization
	if (!providedToken) {
		ctx.status = 401
		return
	}

	if (!providedToken.startsWith("Bearer ")) {
		ctx.status = 400
		return
	}

	providedToken = providedToken.slice(7)

	if (providedToken !== token) {
		ctx.status = 403
		return
	}

	await next()
})

router.get("/auth", ctx => {
	ctx.status = 204
})

router.get("/buckets", async ctx => {
	const objects = await readdir("./buckets", { withFileTypes: true })
	ctx.status = 200
	ctx.body = objects.map(o => o.name)
})

router.put("/buckets/:bucket", async ctx => {
	const bucket = join(bucketDir, ctx.params.bucket)
	if (transversal(bucketDir, bucket)) {
		ctx.status = 403
		return
	}

	try {
		await mkdir(bucket)
		ctx.status = 201
	} catch (error) {
		ctx.status = 409
	}
})

router.delete("/buckets/:bucket", async ctx => {
	const bucket = join(bucketDir, ctx.params.bucket)
	if (transversal(bucketDir, bucket)) {
		ctx.status = 403
	} else {
		await rm(bucket, { recursive: true })
		ctx.status = 204
	}
})

router.get("/list/:bucket", async ctx => {
	if (ctx.query.path && typeof ctx.query.path !== "string") {
		ctx.status = 400
		return
	}

	const bucket = join(bucketDir, ctx.params.bucket)
	const path = join(bucket, ctx.query.path ?? "")

	if (transversal(bucketDir, bucket) || transversal(bucket, path)) {
		ctx.status = 403
		return
	}

	try {
		const objects = await readdir(path, { withFileTypes: true })
		const filteredObjects = objects.map(o => ({
			name: o.name,
			path: join(relative(o.path, bucket), o.name),
			type: o.isDirectory() ? "directory" : "file",
		}))

		ctx.status = 200
		ctx.body = filteredObjects
	} catch (error) {
		ctx.status = 404
	}
})

router.get("/object/:bucket/:object", async ctx => {
	const objectPath = join(bucketDir, ctx.params.bucket, ctx.params.object)

	if (transversal(bucketDir, objectPath)) {
		ctx.status = 403
		return
	}

	try {
		const stats = await stat(objectPath)
		if (stats.isFile()) {
			ctx.attachment(objectPath)
			ctx.status = 200
			ctx.body = createReadStream(objectPath)
		} else {
			ctx.status = 404
		}
	} catch (error) {
		ctx.status = 404
	}
})

router.delete("/object/:bucket/:object", async ctx => {
	const objectPath = join(bucketDir, ctx.params.bucket, ctx.params.object)

	if (transversal(bucketDir, objectPath)) {
		ctx.status = 403
		return
	}

	try {
		await rm(objectPath, { recursive: true })
		ctx.status = 204
	} catch (error) {
		ctx.status = 404
	}
})

router.post("/object/:bucket/:object", upload.single(), async ctx => {
	const objectPath = join(bucketDir, ctx.params.bucket, ctx.params.object)

	if (!ctx.request.file) {
		ctx.status = 400
		return
	}

	if (transversal(bucketDir, objectPath)) {
		ctx.status = 403
		return
	}

	const file = ctx.request.file

	try {
		await mkdir(dirname(objectPath), { recursive: true })
		await writeFile(objectPath, file.buffer)
		ctx.status = 201
	} catch (error) {
		ctx.status = 500
	}
})

router.patch("/object/:bucket/:object", async ctx => {
	const objectPath = join(bucketDir, ctx.params.bucket, ctx.params.object)

	if (transversal(bucketDir, objectPath)) {
		ctx.status = 403
		return
	}

	try {
		const stats = await stat(objectPath)

		if (stats.isFile()) {
			const id = await createLink(objectPath)
			ctx.body = `${ctx.URL.origin}/shared/${id.content}`
		} else {
			ctx.status = 404
		}
	} catch (error) {
		ctx.status = 404
	}
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(12543, () => console.info("Server listening!"))

const transversal = (root: string, attempt: string) => !resolve(normalize(attempt)).startsWith(root)
const relative = (path: string, to: string) => path.slice(to.length)
