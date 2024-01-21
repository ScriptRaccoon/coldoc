import { Server } from "socket.io"
import { get_doc, get_or_create } from "./docs.js"

export function handle_sockets(server) {
	const io = new Server(server)

	io.on("connection", (socket) => {
		socket.on("join", (doc_id) => handle_join(socket, doc_id))
		socket.on("text", (text) => handle_text(socket, text))
		socket.on("title", (title) => handle_title(socket, title))
		socket.on("name", (name) => handle_name(socket, name))
		socket.on("disconnect", () => handle_disconnection(socket))
	})

	function send_editor_names(doc) {
		io.to(doc.id).emit("editor_names", Object.values(doc.editors))
	}

	function handle_join(socket, doc_id) {
		const doc = get_or_create(doc_id)
		socket.join(doc_id)
		socket.data.doc_id = doc_id
		socket.data.name = "Anonymous"
		doc.editors[socket.id] = socket.data.name
		socket.emit("text", doc.text)
		socket.emit("title", doc.title)
	}

	function handle_text(socket, text) {
		const doc_id = socket.data.doc_id
		const doc = get_doc(doc_id)
		if (!doc) return

		const current_editor = doc.current_editor
		if (current_editor && current_editor !== socket.id) return
		doc.current_editor = socket.id

		socket.to(doc_id).emit("allow_typing", false)

		doc.text = text
		io.to(doc_id).emit("text", text)
		io.to(doc_id).emit("status", `${socket.data.name} is typing...`)

		if (doc.typing_timeout) {
			clearTimeout(doc.typing_timeout)
			doc.typing_timeout = null
		}

		doc.typing_timeout = setTimeout(() => {
			io.to(doc_id).emit("status", "")
			io.to(doc_id).emit("allow_typing", true)
			doc.current_editor = null
		}, 1000)
	}

	function handle_title(socket, title) {
		const doc_id = socket.data.doc_id
		const doc = get_doc(doc_id)
		if (!doc) return

		doc.title = title
		io.to(doc_id).emit("title", title)
	}

	function handle_name(socket, name) {
		socket.data.name = name

		const doc_id = socket.data.doc_id
		const doc = get_doc(doc_id)
		if (!doc) return

		doc.editors[socket.id] = name
		send_editor_names(doc)
	}

	function handle_disconnection(socket) {
		const doc_id = socket.data.doc_id
		socket.leave(doc_id)
		const doc = get_doc(doc_id)
		if (!doc) return
		delete doc.editors[socket.id]
		send_editor_names(doc)
	}
}
