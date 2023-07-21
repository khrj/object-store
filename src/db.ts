import { PrismaClient } from "@prisma/client"
import { randomBytes } from "crypto"

const prisma = new PrismaClient()

export const trackFile = (path: string) => prisma.file.create({ data: { path } })
export const untrackFile = (path: string) => prisma.file.delete({ where: { path } })

export const createLink = (path: string) =>
	prisma.link.create({
		data: {
			content: randomBytes(100).toString("hex"),
			file: { connectOrCreate: { create: { path }, where: { path } } },
		},
	})

export const resolveLink = (link: string) =>
	prisma.link.findUniqueOrThrow({ where: { content: link }, select: { filePath: true } })

export const getToken = async () => {
	try {
		const token = await prisma.token.findFirstOrThrow()
		return token.content
	} catch {
		const token = randomBytes(100).toString("hex")
		await prisma.token.create({ data: { content: token } })
		return token
	}
}
