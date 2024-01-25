const clear_button = document.getElementById("clear_button")
const recent_docs_display = document.getElementById("recent_docs")
const recent_docs_list = recent_docs_display.querySelector("ul")

init()

function init() {
	const recent_docs = get_saved_recent_docs()
	display_recent_docs(recent_docs)
	clear_button.addEventListener("click", clear_recent_docs)
}

function get_saved_recent_docs() {
	try {
		return JSON.parse(localStorage.getItem("recent_docs") ?? "[]")
	} catch (err) {
		console.error(err)
		return []
	}
}

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

function clear_recent_docs() {
	localStorage.removeItem("recent_docs")
	recent_docs_display.setAttribute("hidden", "")
	recent_docs_list.innerHTML = ""
}
