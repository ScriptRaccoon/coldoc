import dotenv from "dotenv"

import { handle_sockets } from "./sockets.js"
import { connect_to_db } from "./mongodb.js"
import { generate_server } from "./express.js"
import { purge_old_docs } from "./docs.js"

async function init() {
	dotenv.config()
	const server = generate_server()
	handle_sockets(server)
	await connect_to_db()
	await purge_old_docs()
}

init()
