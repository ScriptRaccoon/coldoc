import express from "express"
import router from "./router.js"

import { resolve_path } from "./utils.js"

export function generate_server() {
	const app = express()
	const PORT = process.env.PORT || 3000

	app.use(express.static(resolve_path("..", "static")))
	app.set("view engine", "ejs")
	app.set("views", resolve_path("..", "pages"))

	app.use(router)

	const server = app.listen(PORT, () => {
		console.info(`Server is listening on port ${PORT}`)
	})

	return server
}
