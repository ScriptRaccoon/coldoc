import express from "express"
import { generate_ID, generate_recent_documents } from "./utils.js"
import { set_recent_ids, set_user } from "./middlewares.js"

const router = express.Router()

router.use(set_user)

router.get("/", (req, res) => {
	const recent_documents = generate_recent_documents(
		req.user?.recent_ids ?? []
	)
	res.render("home", { recent_documents })
})

router.post("/new", (_, res) => {
	const doc_id = generate_ID()
	res.redirect(`/document/${doc_id}`)
})

router.get("/document/:id", set_recent_ids, (req, res) => {
	const doc_id = req.params.id
	res.render("document", { doc_id })
})

router.use((_, res) => {
	res.status(404).render("404")
})

export default router
