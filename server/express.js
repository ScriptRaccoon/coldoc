import express from "express"
import router from "./router.js"

import { resolve_path } from "./utils.js"
import cookie_parser from "cookie-parser"

export function generate_server() {
	const app = express()
	const PORT = process.env.PORT || 3000

	app.use(cookie_parser())
	app.use(express.static(resolve_path("..", "static")))
	app.set("view engine", "ejs")
	app.set("views", resolve_path("..", "pages"))

	app.use(router)

	const server = app.listen(PORT, () => {
		console.info(`Server is listening on port ${PORT}`)
	})

	return server
}
