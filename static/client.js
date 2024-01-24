const textarea = document.getElementById("textarea")
const title_input = document.getElementById("title_input")
const name_input = document.getElementById("name_input")
const editor_names_display = document.getElementById("editor_names")
const word_count_display = document.getElementById("word_count")
const copy_button = document.getElementById("copy_button")
const delete_button = document.getElementById("delete_button")
const main_element = document.querySelector("main")
const text_status = document.getElementById("text_status")
const title_status = document.getElementById("title_status")

init()

function init() {
	const io = window.io
	const socket = io()
	socket.on("connect", () => handle_socket_actions(socket))
	display_word_count(textarea.value)
	add_to_recent_docs(document.title)
	enable_copy_button()
}

function handle_socket_actions(socket) {
	join(socket)
	sync_name(socket)
	handle_text_input(socket)
	handle_title_input(socket)
	handle_editor_names(socket)
	handle_delete(socket)
}

function get_doc_id() {
	return document.body.getAttribute("data-doc-id")
}

function join(socket) {
	socket.emit("join", get_doc_id())
}

function sync_name(socket) {
	const my_name = localStorage.getItem("name") ?? "Anonymous"

	name_input.value = my_name
	socket.emit("name", my_name)

	name_input.addEventListener("input", () => {
		socket.emit("name", name_input.value)
		localStorage.setItem("name", name_input.value)
	})
}

function handle_text_input(socket) {
	sync_input(socket, "text", textarea, text_status, (value) => {
		display_word_count(value)
	})
}

function handle_title_input(socket) {
	sync_input(socket, "title", title_input, title_status, (value) => {
		document.title = value || "Untitled"
		add_to_recent_docs()
	})
}

function sync_input(socket, event, input_element, status_element, callback) {
	input_element.addEventListener("input", () => {
		socket.emit(event, input_element.value)
		if (callback) callback(input_element.value)
	})

	socket.on(event, (value) => {
		input_element.value = value
		if (callback) callback(value)
	})

	socket.on(`allow_${event}_input`, (allowed) => {
		input_element.disabled = !allowed
	})

	socket.on(`${event}_status`, (status) => {
		status_element.innerHTML = status ? status : "&nbsp;"
	})
}

function handle_editor_names(socket) {
	socket.on("editor_names", (names) => {
		editor_names_display.innerText = names.join(", ")
	})
}

function handle_delete(socket) {
	delete_button.addEventListener("click", () => {
		const sure = confirm("Are you sure you want to delete this document?")
		if (sure) socket.emit("delete")
	})

	socket.on("deleted", display_deletion)
}

function get_word_count(text) {
	const words = text
		.trim()
		.split(/\s+/)
		.filter((word) => word !== "")
	return words.length
}

function display_word_count(text) {
	word_count_display.innerText = `${get_word_count(text)} words`
}

function add_to_recent_docs() {
	const id = get_doc_id()
	const title = document.title
	try {
		const recents = JSON.parse(localStorage.getItem("recent_docs") ?? "[]")
		const others = recents.filter((doc) => doc?.id !== id)
		const updated = [{ id, title }, ...others].slice(0, 10)
		localStorage.setItem("recent_docs", JSON.stringify(updated))
	} catch (err) {
		console.error(err)
	}
}

function remove_from_recent_docs() {
	const id = get_doc_id()
	try {
		const recents = JSON.parse(localStorage.getItem("recent_docs") ?? "[]")
		const others = recents.filter((doc) => doc?.id !== id)
		localStorage.setItem("recent_docs", JSON.stringify(others))
	} catch (err) {
		console.error(err)
	}
}

function display_deletion() {
	remove_from_recent_docs()
	main_element.innerHTML =
		"This document has been deleted. " +
		"You will be redirected to the home page ..."
	setTimeout(() => {
		window.location.href = "/"
	}, 3000)
}

function enable_copy_button() {
	copy_button.addEventListener("click", copy_URL)
}

async function copy_URL() {
	const url = window.location.href
	await navigator.clipboard.writeText(url)
	copy_button.classList.add("copied")
	setTimeout(() => {
		copy_button.classList.remove("copied")
	}, 1000)
}
