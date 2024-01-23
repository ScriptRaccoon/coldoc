import express from "express"
import { set_user, update_recent_docs } from "./middlewares.js"
import { create_doc, get_doc } from "./docs.js"

const router = express.Router()

router.use(set_user)

router.get("/", (req, res) => {
	const recent_docs = req.user?.recent_docs ?? []
	res.render("home", { recent_docs })
})

router.post("/new", async (_, res) => {
	const doc = await create_doc()
	if (!doc) return res.status(500).send("Could not create document")
	const doc_id = doc._id.toString()
	res.redirect(`/document/${doc_id}`)
})

router.get("/document/:id", async (req, res) => {
	const doc_id = req.params.id
	const doc = await get_doc(doc_id)
	if (!doc) return res.status(404).render("404")
	const { title, text } = doc
	update_recent_docs(req, res, doc_id, title)
	res.render("document", { doc_id, title, text })
})

router.use((_, res) => {
	res.status(404).render("404")
})

export default router
