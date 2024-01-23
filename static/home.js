function get_saved_recent_docs() {
	try {
		return JSON.parse(localStorage.getItem("recent_docs") ?? "[]")
	} catch (err) {
		console.error(err)
		return []
	}
}

function display_recent_docs() {
	const recent_docs = get_saved_recent_docs()
	if (recent_docs.length === 0) return
	const recent_docs_display = document.querySelector(".recent_docs")
	const recent_docs_list = recent_docs_display.querySelector("ul")
	if (!recent_docs_display || !recent_docs_list) return
	recent_docs_display.removeAttribute("hidden")
	recent_docs_list.innerHTML = ""
	recent_docs.forEach((doc) => {
		const is_ok = typeof doc === "object" && "id" in doc && "title" in doc
		if (!is_ok) return
		const item = document.createElement("li")
		const link = document.createElement("a")
		link.href = `/document/${doc.id}`
		link.classList.add("link")
		link.innerText = doc.title || "Untitled"
		item.appendChild(link)
		recent_docs_list.appendChild(item)
	})
}

display_recent_docs()
