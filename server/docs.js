import { doc_model } from "./model.js"

/**
 * @typedef {object} Doc - A document in the database.
 * @property {string} title - The title of the document.
 * @property {string} text - The text content of the document.
 * @property {string} public_id - The public id of the document.
 * @property {Date} createdAt - The date the document was created.
 * @property {Date} updatedAt - The date the document was last updated.
 */

/**
 * @typedef {object} Doc_Error - An error that occurred while accessing a document.
 * @property {string} message - The error message.
 * @property {number} status - The HTTP status code.
 */

/**
 * Gets a document from the database.
 * @param {string} id - The id of the document.
 * @returns {Promise<{doc: Doc, error: null} | {doc: null, error: Doc_Error}>}
 */
export async function get_doc(id) {
	try {
		const doc = await doc_model.findOne({ public_id: id })
		if (doc) return { doc, error: null }

		console.error(`No document found with id: ${id}`)
		return {
			doc: null,
			error: { message: "No document found with that id", status: 404 },
		}
	} catch (err) {
		console.error(`Could not access document with id: ${id}`)
		console.error(err)
		return {
			doc: null,
			error: { message: "Could not access document", status: 500 },
		}
	}
}

/**
 * Creates a document in the database.
 * @returns {Promise<{doc: Doc, error: null} | {doc: null, error: Doc_Error}>}
 */
export async function create_doc() {
	const doc = new doc_model()
	try {
		return { doc: await doc.save(), error: null }
	} catch (err) {
		console.error("Could not create document in db")
		console.error(err)
		return {
			doc: null,
			error: { message: "Could not create document", status: 500 },
		}
	}
}

/**
 * Updates a document in the database.
 * @param {string} id - The id of the document.
 * @param {Partial<Doc>} updates - The updates to apply to the document.
 * @returns {Promise<{doc: Doc, error: null} | {doc: null, error: Doc_Error}>}
 */
export async function update_doc(id, updates) {
	try {
		const doc = await doc_model.findOneAndUpdate(
			{ public_id: id },
			updates,
			{ new: true }
		)
		if (doc) return { doc, error: null }

		console.error(`No document found with id: ${id}`)
		return {
			doc: null,
			error: { message: "No document found with that id", status: 404 },
		}
	} catch (err) {
		console.error(`Could not update document with id: ${id}`)
		console.error(err)
		return {
			doc: null,
			error: { message: "Could not update document", status: 500 },
		}
	}
}

/**
 * Deletes a document from the database.
 * @param {string} id - The id of the document.
 * @returns {Promise<{doc: Doc, error: null} | {doc: null, error: Doc_Error}>}
 */
export async function delete_doc(id) {
	try {
		const doc = await doc_model.findOneAndDelete({ public_id: id })
		if (doc) return { doc, error: null }

		console.error(`No document found with id: ${id}`)
		return {
			doc: null,
			error: { message: "No document found with that id", status: 404 },
		}
	} catch (err) {
		console.error(`Could not delete document with id: ${id}`)
		console.error(err)
		return {
			doc: null,
			error: { message: "Could not delete document", status: 500 },
		}
	}
}

/**
 * Deletes all documents older than one year.
 * @returns {Promise<void>}
 */
export async function purge_old_docs() {
	const one_year_ago = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
	try {
		const result = await doc_model.deleteMany({
			updatedAt: { $lt: one_year_ago },
		})
		console.info(`Deleted ${result.deletedCount} old documents`)
	} catch (err) {
		console.error("Could not purge old documents")
		console.error(err)
	}
}
