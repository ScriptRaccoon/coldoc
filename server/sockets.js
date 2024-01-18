import { Server as HttpServer } from "http"

import { Server, Socket } from "socket.io"
import { get_doc, get_or_create } from "./docs.js"

/**
 * @typedef {Object} SocketData The data attached to a socket.
 * @property {string} doc_id - The document id.
 * @property {string} name - The name of the user.
 */

/**
 * @typedef {Socket & { data: SocketData }} CustomSocket
 */

/**
 * @param {HttpServer} server
 * @description Handles the socket connection and actions.
 */
export function handle_sockets(server) {
	const io = new Server(server)

	io.on(
		"connection",
		/** @param {CustomSocket} socket */
		(socket) => {
			socket.on(
				"doc_id",
				/** @param {string} doc_id */
				(doc_id) => {
					const doc = get_or_create(doc_id)
					socket.join(doc_id)
					socket.data.doc_id = doc_id
					socket.data.name = "Anonymous"
					doc.editors[socket.id] = socket.data.name
					socket.emit("text", doc.text)
					socket.emit("title", doc.title)
				}
			)

			socket.on(
				"text",
				/** @param {string} text */
				(text) => {
					const doc_id = socket.data.doc_id
					const doc = get_doc(doc_id)
					if (!doc) return

					doc.text = text
					io.to(doc_id).emit("text", text)
					io.to(doc_id).emit(
						"status",
						`${socket.data.name} is typing...`
					)

					if (doc.typing_timeout) {
						clearTimeout(doc.typing_timeout)
						doc.typing_timeout = null
					}

					doc.typing_timeout = setTimeout(() => {
						io.to(doc_id).emit("status", "")
					}, 1000)
				}
			)

			socket.on(
				"title",
				/** @param {string} title */
				(title) => {
					const doc_id = socket.data.doc_id
					const doc = get_doc(doc_id)
					if (!doc) return

					doc.title = title
					io.to(doc_id).emit("title", title)
				}
			)

			socket.on(
				"name",
				/** @param {string} name */
				(name) => {
					socket.data.name = name

					const doc_id = socket.data.doc_id
					const doc = get_doc(doc_id)
					if (!doc) return

					doc.editors[socket.id] = name
					send_editor_names(doc)
				}
			)

			socket.on("disconnect", () => {
				const doc_id = socket.data.doc_id
				socket.leave(doc_id)
				const doc = get_doc(doc_id)
				if (!doc) return
				delete doc.editors[socket.id]
				send_editor_names(doc)
			})

			/**
			 * @param {import('./docs.js').Doc} doc
			 * @description Sends the list of editor names to the clients.
			 */
			function send_editor_names(doc) {
				io.to(doc.id).emit("editor_names", Object.values(doc.editors))
			}
		}
	)
}
