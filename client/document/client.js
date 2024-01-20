const textarea = document.getElementById("textarea")
const title_input = document.getElementById("title_input")
const name_input = document.getElementById("name_input")
const status_message = document.getElementById("status_message")
const editor_names = document.getElementById("editor_names")
const word_count_display = document.getElementById("word_count")

init()

function init() {
	const io = window.io
	const socket = io()
	handle_socket(socket)
}

function handle_socket(socket) {
	send_doc_id(socket)
	sync_name(socket)
	handle_text_input(socket)
	handle_title_input(socket)
	handle_status(socket)
	handle_editor_names(socket)
	handle_allow_typing(socket)
}

function get_doc_id() {
	const path = window.location.pathname
	const segments = path.split("/")
	if (segments.length === 0) throw new Error("No ID found")
	return segments[segments.length - 1]
}

function send_doc_id(socket) {
	const doc_id = get_doc_id()
	socket.emit("doc_id", doc_id)
}

function sync_name(socket) {
	const my_name = localStorage.getItem("name") ?? "Anonymous"

	name_input.value = my_name
	socket.emit("name", my_name)

	name_input.addEventListener("input", () => {
		const name = name_input.value
		socket.emit("name", name)
		localStorage.setItem("name", name)
	})
}

function handle_text_input(socket) {
	textarea.addEventListener("input", () =>
		socket.emit("text", textarea.value)
	)

	socket.on("text", (text) => {
		textarea.value = text
		word_count_display.innerText = get_word_count(text) + " words"
	})
}

function handle_title_input(socket) {
	title_input.addEventListener("input", () => {
		socket.emit("title", title_input.value)
	})

	socket.on("title", (title) => {
		title_input.value = title
		document.title = title
	})
}

function handle_editor_names(socket) {
	socket.on("editor_names", (names) => {
		editor_names.innerText = names.join(", ")
	})
}

function handle_status(socket) {
	socket.on("status", (status) => {
		status_message.innerText = status
	})
}

function get_word_count(text) {
	const words = text
		.trim()
		.split(/\s+/)
		.filter((word) => word !== "")
	return words.length
}

function handle_allow_typing(socket) {
	socket.on("allow_typing", (allow) => {
		textarea.disabled = !allow
	})
}
