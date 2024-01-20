const documents = {}

export function get_doc(id) {
	return documents[id]
}

export function get_or_create(id) {
	const existing_doc = documents[id]
	if (existing_doc) return existing_doc

	const doc = {
		title: "Untitled document",
		text: "",
		id,
		editors: {},
		typing_timeout: null,
	}

	documents[id] = doc

	return doc
}
