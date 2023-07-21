module.exports = {
	root: true,
	env: {
		node: true,
		es2021: true,
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"],
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
	],
	rules: {
		"no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
		"prefer-const": [
			"error",
			{
				destructuring: "all",
			},
		],
		"dot-notation": "error",
		eqeqeq: "error",
		"no-return-await": "error",
		"no-unneeded-ternary": "error",
		"no-var": "error",
		"no-void": "error",
		"prefer-numeric-literals": "error",
		yoda: "error",
		quotes: [
			"error",
			"double",
			{
				avoidEscape: true,
			},
		],
	},
}
