const docs_memory = {}

export function get_doc_in_memory(id) {
	return docs_memory[id]
}

export function get_or_create_doc_in_memory(id) {
	const existing_doc = docs_memory[id]
	if (existing_doc) return existing_doc
	const doc_mem = {
		id,
		editors: {},
		text_timeout: null,
		title_timeout: null,
		current_editor: null,
	}
	docs_memory[id] = doc_mem

	return doc_mem
}
