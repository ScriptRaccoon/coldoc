/**
 * Used to store the documents in memory.
 * @typedef {object} Doc_Memory
 * @property {string} id
 * @property {Record<string,string>} editors
 * @property {string | null} text_editor
 * @property {string | null} title_editor
 * @property {NodeJS.Timeout | null} text_timeout
 * @property {NodeJS.Timeout | null} title_timeout
 */

/**
 * The documents in memory, indexed by their id.
 * @type {Record<string, Doc_Memory>}
 */
const docs_memory = {}

/**
 * Gets a document from memory.
 * @param {string} id - The id of the document.
 * @returns {Doc_Memory | undefined} The document, or undefined if it doesn't exist.
 */
export function get_doc_in_memory(id) {
	return docs_memory[id]
}

/**
 * Gets a document from memory, or creates it if it doesn't exist.
 * @param {string} id - The id of the document.
 * @returns {Doc_Memory} The document.
 */
export function get_or_create_doc_in_memory(id) {
	const existing_doc = docs_memory[id]
	if (existing_doc) return existing_doc
	const doc_mem = {
		id,
		editors: {},
		text_editor: null,
		title_editor: null,
		text_timeout: null,
		title_timeout: null,
	}
	docs_memory[id] = doc_mem
	return doc_mem
}

/**
 * Deletes a document from memory.
 * @param {string} id - The id of the document.
 */
export function delete_doc_in_memory(id) {
	delete docs_memory[id]
}
