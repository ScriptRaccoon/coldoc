/**
 * The textarea element of the document.
 */
const textarea = /**  * @type {HTMLTextAreaElement} */ (
	document.querySelector("textarea")
)

/**
 * The title input element of the document.
 */
const title_input = /** @type {HTMLInputElement} */ (
	document.querySelector("#title_input")
)

/**
 * The name input element for the user.
 */
const name_input = /** @type {HTMLInputElement} */ (
	document.querySelector("#name_input")
)

/**
 * The button to copy the URL of the document.
 *
 */
const copy_button = /** @type {HTMLButtonElement} */ (
	document.querySelector("#copy_button")
)

/**
 * The button to delete the document.
 */
const delete_button = /** @type {HTMLButtonElement} */ (
	document.querySelector("#delete_button")
)

/**
 * The main element of the document.
 */
const main_element = /** @type {HTMLElement} */ (document.querySelector("main"))

/**
 * The status element for the text.
 */
const text_status = /** @type {HTMLElement} */ (
	document.getElementById("text_status")
)

/**
 * The status element for the title.
 */
const title_status = /** @type {HTMLElement} */ (
	document.getElementById("title_status")
)

/**
 * The element to display the names of the editors.
 */
const editor_names_display = /** @type {HTMLElement} */ (
	document.getElementById("editor_names")
)

/**
 * The element to display the word count.
 */
const word_count_display = /** @type {HTMLElement} */ (
	document.getElementById("word_count")
)

/**
 * @typedef {import("socket.io-client").Socket} Socket
 */

/**
 * Initializes the client application.
 */
function init() {
	// @ts-ignore
	const io = window.io
	/**
	 * @type {Socket}
	 */
	const socket = io()
	socket.on("connect", () => handle_socket_actions(socket))
	display_word_count(textarea?.value ?? "")
	add_to_recent_docs()
	enable_copy_button()
}

init()

/**
 * Handles the socket actions.
 * @param {Socket} socket - The socket to handle.
 */
function handle_socket_actions(socket) {
	join(socket)
	sync_name(socket)
	handle_text_input(socket)
	handle_title_input(socket)
	handle_editor_names(socket)
	handle_delete(socket)
}

/**
 * Gets the id of the document.
 * @returns {string} The id of the document.
 */
function get_doc_id() {
	return document.body.getAttribute("data-doc-id") ?? ""
}

/**
 * Joins the socket to the document's room.
 * @param {Socket} socket - The socket to handle.
 */
function join(socket) {
	socket.emit("join", get_doc_id())
}

/**
 * Syncs the user's name with the socket name on the server.
 * @param {Socket} socket - The socket to handle.
 */
function sync_name(socket) {
	const my_name = localStorage.getItem("name") ?? "Anonymous"

	name_input.value = my_name
	socket.emit("name", my_name)

	name_input.addEventListener("input", () => {
		socket.emit("name", name_input.value)
		localStorage.setItem("name", name_input.value)
	})
}

/**
 * Handles the text input.
 * @param {Socket} socket - The socket to handle.
 */
function handle_text_input(socket) {
	sync_input(socket, "text", textarea, text_status, display_word_count)
}

/**
 * Handles the title input.
 * @param {Socket} socket - The socket to handle.
 */
function handle_title_input(socket) {
	// prettier-ignore
	sync_input(socket, "title", title_input, title_status,
	 (title) => {
		document.title = title || "Untitled"
		add_to_recent_docs()
	})
}

/**
 * Syncs an input element between client and server.
 * @param {Socket} socket - The socket to handle.
 * @param {string} event - The event name.
 * @param {HTMLInputElement | HTMLTextAreaElement} input_element - The input element to sync.
 * @param {HTMLElement} status_element - The element to display the status.
 * @param {((value: string) => void) | undefined} callback - The callback to call when the input changes.
 */
function sync_input(socket, event, input_element, status_element, callback) {
	input_element.addEventListener("input", () => {
		socket.emit(event, input_element.value)
		if (callback) callback(input_element.value)
	})

	// prettier-ignore
	socket.on(event, /** @param {string} value */ (value) => {
		input_element.value = value
		if (callback) callback(value)
	})

	// prettier-ignore
	socket.on(`allow_${event}_input`, /** @param {boolean} allowed */ (allowed) => {
		input_element.disabled = !allowed
	})

	// prettier-ignore
	socket.on(`${event}_status`, /** @param {string} status */ (status) => {
		status_element.innerHTML = status ? status : "&nbsp;"
	})
}

/**
 * Displays the names of the editors in the document.
 * @param {Socket} socket - The socket to handle.
 */
function handle_editor_names(socket) {
	socket.on("editor_names", (names) => {
		editor_names_display.innerText = names.join(", ")
	})
}

/**
 * Enables the delete button and handles the deletion.
 * @param {Socket} socket - The socket to handle.
 */
function handle_delete(socket) {
	delete_button.addEventListener("click", () => {
		const sure = confirm("Are you sure you want to delete this document?")
		if (sure) socket.emit("delete")
	})

	socket.on("deleted", display_deletion)
}

/**
 * Displays the deletion of the document.
 */
function display_deletion() {
	remove_from_recent_docs()
	main_element.innerHTML =
		"This document has been deleted. " +
		"You will be redirected to the home page ..."
	setTimeout(() => {
		window.location.href = "/"
	}, 3000)
}

/**
 * Gets the word count of a text.
 * @param {string} text - The text to count.
 * @returns {number} The word count.
 */
function get_word_count(text) {
	const words = text
		.trim()
		.split(/\s+/)
		.filter((word) => word !== "")
	return words.length
}

/**
 * Displays the word count of a text.
 * @param {string} text - The text to count.
 */
function display_word_count(text) {
	word_count_display.innerText = `${get_word_count(text)} words`
}

/**
 * @typedef {object} Doc_Recent
 * @property {string} id - The id of the document.
 * @property {string} title - The title of the document.
 */

/**
 * @returns {Doc_Recent[]} The recent documents saved in the local storage.
 */
function get_recent_docs() {
	try {
		return JSON.parse(localStorage.getItem("recent_docs") ?? "[]")
	} catch (err) {
		console.error(err)
		return []
	}
}

/**
 * Adds the current document to the recent documents saved in the local storage.
 */
function add_to_recent_docs() {
	const id = get_doc_id()
	const title = document.title
	const recents = get_recent_docs()
	const others = recents.filter((doc) => doc?.id !== id)
	const updated = [{ id, title }, ...others].slice(0, 10)
	localStorage.setItem("recent_docs", JSON.stringify(updated))
}

/**
 * Removes the current document from the recent documents saved in the local storage.
 */
function remove_from_recent_docs() {
	const id = get_doc_id()
	const recents = get_recent_docs()
	const others = recents.filter((doc) => doc?.id !== id)
	localStorage.setItem("recent_docs", JSON.stringify(others))
}

/**
 * Enables the copy URL button.
 */
function enable_copy_button() {
	const copy_URL = async () => {
		const url = window.location.href
		await navigator.clipboard.writeText(url)
		copy_button.classList.add("copied")
		setTimeout(() => {
			copy_button.classList.remove("copied")
		}, 1000)
	}

	copy_button.addEventListener("click", copy_URL)
}
