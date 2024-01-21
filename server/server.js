import express from "express"

import router from "./router.js"
import { handle_sockets } from "./sockets.js"
import { resolve_path } from "./utils.js"

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(resolve_path("..", "static")))
app.set("view engine", "ejs")
app.set("views", resolve_path("..", "pages"))

const server = app.listen(PORT, () => {
	console.info(`Server is listening on port ${PORT}`)
})

app.use(router)

handle_sockets(server)
