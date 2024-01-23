import express from "express"
import { create_doc, get_doc } from "./docs.js"

const router = express.Router()

router.get("/", (_, res) => {
	res.render("home")
})

router.post("/new", async (_, res) => {
	const doc = await create_doc()
	if (doc.error) {
		return res.render("error", { status: doc.status, message: doc.error })
	}
	const doc_id = doc._id.toString()
	res.redirect(`/document/${doc_id}`)
})

router.get("/document/:id", async (req, res) => {
	const doc_id = req.params.id
	const doc = await get_doc(doc_id)
	if (doc.error) {
		return res.render("error", { status: doc.status, message: doc.error })
	}
	const { title, text } = doc
	res.render("document", { doc_id, title, text })
})

router.use((_, res) => {
	res.render("error", {
		status: 404,
		message: "This page could not be found",
	})
})

export default router
