const documents_db = {}

export function get_doc(id) {
	return documents_db[id]
}

export function get_or_create(id) {
	const existing_doc = documents_db[id]
	if (existing_doc) return existing_doc
	const doc = {
		title: "Untitled Document",
		text: "",
		id,
		editors: {},
		typing_timeout: null,
		current_editor: null,
	}
	documents_db[id] = doc
	return doc
}
