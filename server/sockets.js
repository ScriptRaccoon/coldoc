import { Server } from "socket.io"
import { delete_doc, update_doc } from "./docs.js"
import {
	get_or_create_doc_in_memory,
	get_doc_in_memory,
	delete_doc_in_memory,
} from "./docs_memory.js"

export function handle_sockets(server) {
	const io = new Server(server)

	io.on("connection", (socket) => {
		socket.on("join", (doc_id) => handle_join(socket, doc_id))
		socket.on("text", (text) => handle_input(socket, "text", text))
		socket.on("title", (title) => handle_input(socket, "title", title))
		socket.on("name", (name) => handle_name(socket, name))
		socket.on("disconnect", () => handle_disconnection(socket))
		socket.on("delete", () => handle_delete(socket))
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

	function handle_input(socket, event, value) {
		const doc_id = socket.data.doc_id
		const doc_mem = get_doc_in_memory(doc_id)
		if (!doc_mem) return

		const timeout_key = `${event}_timeout`
		const editor_key = `${event}_editor`
		const status_event = `${event}_status`
		const allow_event = `allow_${event}_input`

		const previous_editor = doc_mem[editor_key]
		if (previous_editor && previous_editor !== socket.id) return

		doc_mem[editor_key] = socket.id

		if (!previous_editor) {
			socket.to(doc_id).emit(allow_event, false)
			io.to(doc_id).emit(status_event, `${socket.data.name} is typing...`)
		}

		socket.to(doc_id).emit(event, value)

		if (doc_mem[timeout_key]) {
			clearTimeout(doc_mem[timeout_key])
			doc_mem[timeout_key] = null
		}

		doc_mem[timeout_key] = setTimeout(async () => {
			socket.to(doc_id).emit(allow_event, true)
			doc_mem[editor_key] = null
			doc_mem[timeout_key] = null
			const update = await update_doc(doc_id, { [event]: value })
			const save_status = update.error ? "Error saving..." : "Saved!"
			io.to(doc_id).emit(status_event, save_status)
			setTimeout(() => {
				if (doc_mem[editor_key]) return
				io.to(doc_id).emit(status_event, "")
			}, 1500)
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

	async function handle_delete(socket) {
		const doc_id = socket.data.doc_id
		const doc_mem = get_doc_in_memory(doc_id)
		if (!doc_mem) return
		delete_doc_in_memory(doc_id)
		const result = await delete_doc(doc_id)
		if (result.error) return
		io.to(doc_id).emit("deleted")
	}

	function send_editor_names(doc_mem) {
		io.to(doc_mem.id).emit("editor_names", Object.values(doc_mem.editors))
	}
}
