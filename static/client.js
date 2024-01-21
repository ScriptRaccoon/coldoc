const textarea = document.getElementById("textarea")
const title_input = document.getElementById("title_input")
const name_input = document.getElementById("name_input")
const status_message_display = document.getElementById("status_message")
const editor_names_display = document.getElementById("editor_names")
const word_count_display = document.getElementById("word_count")
const share_button = document.getElementById("share_button")

init()

function init() {
	const io = window.io
	const socket = io()
	handle_socket(socket)
	share_button.addEventListener("click", copy_URL)
}

function handle_socket(socket) {
	join(socket)
	sync_name(socket)
	handle_text_input(socket)
	handle_title_input(socket)
	handle_status_update(socket)
	handle_editor_names(socket)
	handle_allow_typing(socket)
}

function get_doc_id() {
	const parts = window.location.pathname.split("/")
	return parts[parts.length - 1]
}

function join(socket) {
	const doc_id = get_doc_id()
	socket.emit("join", doc_id)
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
	textarea.addEventListener("input", () => {
		socket.emit("text", textarea.value)
	})

	socket.on("text", (text) => {
		textarea.value = text
		word_count_display.innerText = `${get_word_count(text)} words`
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
		editor_names_display.innerText = names.join(", ")
	})
}

function handle_status_update(socket) {
	socket.on("status", (status) => {
		status_message_display.innerText = status
	})
}

function handle_allow_typing(socket) {
	socket.on("allow_typing", (allowed) => {
		textarea.disabled = !allowed
	})
}

function get_word_count(text) {
	const words = text
		.trim()
		.split(/\s+/)
		.filter((word) => word !== "")
	return words.length
}

function copy_URL() {
	const url = window.location.href
	navigator.clipboard.writeText(url)
	const previous_text = share_button.innerText
	share_button.innerText = "Copied!"
	setTimeout(() => (share_button.innerText = previous_text), 1000)
}