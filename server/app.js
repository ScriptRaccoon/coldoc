import dotenv from "dotenv"

import { handle_sockets } from "./sockets.js"
import { connect_to_db } from "./mongodb.js"
import { generate_server } from "./server.js"
import { purge_old_docs } from "./docs.js"
import { router } from "./router.js"

/**
 * Initializes the application
 */
async function init() {
	dotenv.config()
	const server = generate_server(router)
	handle_sockets(server)
	await connect_to_db()
	await purge_old_docs()
}

init()
