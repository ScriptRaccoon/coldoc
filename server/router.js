import express from "express"
import { generate_ID, resolve_path } from "./utils.js"

const router = express.Router()

router.get("/", (_, res) => {
	res.sendFile(resolve_path("..", "pages", "index.html"))
})

router.post("/new", (_, res) => {
	const doc_id = generate_ID()
	res.redirect(`/document/${doc_id}`)
})

router.get("/document/:id", (_, res) => {
	res.sendFile(resolve_path("..", "pages", "document.html"))
})

export default router
