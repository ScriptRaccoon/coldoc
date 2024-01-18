/**
 * @typedef {object} Doc The document object.
 * @property {string} title - The title of the document.
 * @property {string} text - The text content of the document.
 * @property {string} id - The unique identifier of the document.
 * @property {Object.<string, string>} editors - The map of editors of the document.
 * @property {?NodeJS.Timeout} typing_timeout - The typing timeout of the document.
 */

/**
 * @type {Object.<string, Doc | undefined>}
 * @description The map of documents.
 */
const documents = {}

/**
 * @param {string} id - The unique identifier of the document.
 * @returns {Doc | undefined}
 * @description Gets the document with the given ID.
 */
export function get_doc(id) {
	return documents[id]
}

/**
 * @param {string} id - The unique identifier of the document.
 * @returns {Doc}
 * @description Gets the document with the given ID, or creates it if it does not exist.
 */
export function get_or_create(id) {
	const existing_doc = documents[id]
	if (existing_doc) return existing_doc

	/** @type {Doc} */
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
