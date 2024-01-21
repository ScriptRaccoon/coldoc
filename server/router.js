import express from "express"
import { generate_ID } from "./utils.js"
import { set_user } from "./middlewares.js"

const router = express.Router()

router.use(set_user)

router.get("/", (_, res) => {
	res.render("home")
})

router.post("/new", (_, res) => {
	const doc_id = generate_ID()
	res.redirect(`/document/${doc_id}`)
})

router.get("/document/:id", (req, res) => {
	const doc_id = req.params.id
	res.render("document", { doc_id })
})

router.use((_, res) => {
	res.status(404).render("404")
})

export default router
