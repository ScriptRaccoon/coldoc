import { doc_model } from "./model.js"

export async function get_doc(id) {
	console.log("try to find", id)
	try {
		const doc = await doc_model.findOne({ public_id: id })
		console.log("doc", doc)
		if (doc) return { doc }

		console.error(`No document found with id: ${id}`)
		return {
			error: { message: "No document found with that id", status: 404 },
		}
	} catch (err) {
		console.error(`Could not access document with id: ${id}`)
		console.error(err)
		return {
			error: { message: "Could not access document", status: 500 },
		}
	}
}

export async function create_doc() {
	const doc = new doc_model()
	try {
		return { doc: await doc.save() }
	} catch (err) {
		console.error("Could not create document in db")
		console.error(err)
		return {
			error: { message: "Could not create document", status: 500 },
		}
	}
}

export async function update_doc(id, updates) {
	try {
		const doc = await doc_model.findOneAndUpdate(
			{ public_id: id },
			updates,
			{ new: true }
		)
		if (doc) return { doc }

		console.error(`No document found with id: ${id}`)
		return {
			error: { message: "No document found with that id", status: 404 },
		}
	} catch (err) {
		console.error(`Could not update document with id: ${id}`)
		console.error(err)
		return {
			error: { message: "Could not update document", status: 500 },
		}
	}
}

export async function delete_doc(id) {
	try {
		const doc = await doc_model.findOneAndDelete({ public_id: id })
		if (doc) return { doc }

		console.error(`No document found with id: ${id}`)
		return {
			error: { message: "No document found with that id", status: 404 },
		}
	} catch (err) {
		console.error(`Could not delete document with id: ${id}`)
		console.error(err)
		return {
			error: { message: "Could not delete document", status: 500 },
		}
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
