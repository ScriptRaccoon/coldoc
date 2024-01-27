/**
 * The button to clear the recent documents.
 */
const clear_button = /** @type {HTMLButtonElement} */ (
	document.getElementById("clear_button")
)

/**
 * The element to display the recent documents.
 */
const recent_docs_display = /** @type {HTMLElement} */ (
	document.getElementById("recent_docs")
)

/**
 * The list element to display the recent documents.
 */
const recent_docs_list = /** @type {HTMLUListElement} */ (
	recent_docs_display.querySelector("ul")
)

/**
 * @typedef {import("./client.js").Doc_Recent} Doc_Recent
 */

/**
 * Initializes the home page by handling the recent documents.
 */
function init() {
	const recent_docs = get_recent_docs()
	display_recent_docs(recent_docs)
	clear_button.addEventListener("click", clear_recent_docs)
}

init()

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
 * Displays the recent documents.
 * @param {Doc_Recent[]} recent_docs - The documents to display.
 */
function display_recent_docs(recent_docs) {
	if (recent_docs.length === 0) return
	recent_docs_display.removeAttribute("hidden")
	recent_docs_list.innerHTML = ""
	recent_docs.forEach((doc) => {
		const valid = typeof doc === "object" && "id" in doc && "title" in doc
		if (!valid) return
		const item = document.createElement("li")
		const link = document.createElement("a")
		link.href = `/document/${doc.id}`
		link.classList.add("link")
		link.innerText = doc.title || "Untitled"
		item.appendChild(link)
		recent_docs_list.appendChild(item)
	})
}

/**
 * Clears the recent documents.
 */
function clear_recent_docs() {
	localStorage.removeItem("recent_docs")
	recent_docs_display.setAttribute("hidden", "")
	recent_docs_list.innerHTML = ""
}
