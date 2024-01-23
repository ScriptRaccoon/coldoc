import { doc_model } from "./model.js"

export async function get_doc(id) {
	try {
		const doc = await doc_model.findById(id)
		if (!doc) {
			console.error(`No document found with id: ${id}`)
			return { error: "No document found with that id", status: 404 }
		}
		return doc
	} catch (err) {
		console.error(`Could not access document with id: ${id}`)
		console.error(err)
		return { error: "Could not access document", status: 500 }
	}
}

export async function create_doc() {
	const doc = new doc_model()
	try {
		return await doc.save()
	} catch (err) {
		console.error("Could not create document in db")
		console.error(err)
		return { error: "Could not create document", status: 500 }
	}
}

export async function update_doc(id, updates) {
	try {
		const doc = await doc_model.findByIdAndUpdate(id, updates, {
			new: true,
		})
		if (!doc) {
			console.error(`No document found with id: ${id}`)
			return { error: "No document found with that id", status: 404 }
		}
		return doc
	} catch (err) {
		console.error(`Could not update document with id: ${id}`)
		console.error(err)
		return { error: "Could not update document", status: 500 }
	}
}

export async function delete_doc(id) {
	try {
		const doc = await doc_model.findByIdAndDelete(id)
		if (!doc) {
			console.error(`No document found with id: ${id}`)
			return { error: "No document found with that id", status: 404 }
		}
		return doc
	} catch (err) {
		console.error(`Could not delete document with id: ${id}`)
		console.error(err)
		return { error: "Could not delete document", status: 500 }
	}
}

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
