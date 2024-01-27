import express from "express"

import { resolve_path } from "./utils.js"

/**
 * Generates an express server.
 * @param {express.Router} router - The router to use for the server.
 * @returns {import("http").Server} The generated server.
 */
export function generate_server(router) {
	const app = express()
	const PORT = process.env.PORT || 3000

	app.use(express.static(resolve_path("..", "static")))
	app.set("view engine", "ejs")
	app.set("views", resolve_path("..", "pages"))

	app.use(router)

	return app.listen(PORT, () => {
		console.info(`Server is listening on port ${PORT}`)
	})
}
