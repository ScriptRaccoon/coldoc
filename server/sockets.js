import { Server } from "socket.io"
import { update_doc } from "./docs.js"
import {
	get_or_create_doc_in_memory,
	get_doc_in_memory,
} from "./docs_memory.js"

export function handle_sockets(server) {
	const io = new Server(server)

	io.on("connection", (socket) => {
		socket.on("join", (doc_id) => handle_join(socket, doc_id))
		socket.on("text", (text) => handle_text(socket, text))
		socket.on("title", (title) => handle_title(socket, title))
		socket.on("name", (name) => handle_name(socket, name))
		socket.on("disconnect", () => handle_disconnection(socket))
	})

	function handle_join(socket, doc_id) {
		const doc_mem = get_or_create_doc_in_memory(doc_id)
		socket.join(doc_id)
		socket.data.doc_id = doc_id
		socket.data.name = "Anonymous"
		doc_mem.editors[socket.id] = socket.data.name
	}

	function handle_name(socket, name) {
		socket.data.name = name

		const doc_id = socket.data.doc_id
		const doc_mem = get_doc_in_memory(doc_id)
		if (!doc_mem) return

		doc_mem.editors[socket.id] = name
		send_editor_names(doc_mem)
	}

	function handle_text(socket, text) {
		const doc_id = socket.data.doc_id
		const doc_mem = get_doc_in_memory(doc_id)
		if (!doc_mem) return

		const previous_editor = doc_mem.current_editor
		if (previous_editor && previous_editor !== socket.id) return

		doc_mem.current_editor = socket.id

		if (!previous_editor) {
			socket.to(doc_id).emit("allow_typing", false)
			io.to(doc_id).emit("status", `${socket.data.name} is typing...`)
		}

		socket.to(doc_id).emit("text", text)

		if (doc_mem.text_timeout) {
			clearTimeout(doc_mem.text_timeout)
			doc_mem.text_timeout = null
		}

		doc_mem.text_timeout = setTimeout(async () => {
			socket.to(doc_id).emit("allow_typing", true)
			io.to(doc_id).emit("status", "")
			doc_mem.current_editor = null
			await update_doc(doc_id, { text })
		}, 1000)
	}

	function handle_title(socket, title) {
		if (!title) return
		const doc_id = socket.data.doc_id
		const doc_mem = get_doc_in_memory(doc_id)
		if (!doc_mem) return

		socket.to(doc_id).emit("title", title)

		if (doc_mem.title_timeout) {
			clearTimeout(doc_mem.title_timeout)
			doc_mem.title_timeout = null
		}

		doc_mem.title_timeout = setTimeout(async () => {
			await update_doc(doc_id, { title })
		}, 1000)
	}

	function handle_disconnection(socket) {
		const doc_id = socket.data.doc_id
		socket.leave(doc_id)
		const doc_mem = get_doc_in_memory(doc_id)
		if (!doc_mem) return
		delete doc_mem.editors[socket.id]
		send_editor_names(doc_mem)
	}

	function send_editor_names(doc_mem) {
		io.to(doc_mem.id).emit("editor_names", Object.values(doc_mem.editors))
	}
}
