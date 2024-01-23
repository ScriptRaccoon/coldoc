import dotenv from "dotenv"

import { handle_sockets } from "./sockets.js"
import { connect_to_db } from "./mongodb.js"
import { generate_server } from "./express.js"

function init() {
	dotenv.config()
	const server = generate_server()
	handle_sockets(server)
	connect_to_db()
}

init()
