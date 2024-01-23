import { doc_model } from "./model.js"

export async function get_doc(id) {
	try {
		const doc = await doc_model.findById(id)
		if (!doc) {
			console.error(`No document found with id: ${id}`)
			return null
		}
		return doc
	} catch (err) {
		console.error(`Could not get document with id: ${id}`, err)
		return null
	}
}

export async function create_doc() {
	const doc = new doc_model()
	try {
		return await doc.save()
	} catch (err) {
		console.error("Could not create document in db", err)
		return null
	}
}

export async function update_doc(id, updates) {
	try {
		const doc = await doc_model.findByIdAndUpdate(id, updates, {
			new: true,
		})
		if (!doc) {
			console.error(`No document found with id: ${id}`)
			return null
		}
		return doc
	} catch (err) {
		console.error(`Could not update document with id: ${id}`, err)
		return null
	}
}
