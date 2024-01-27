import express from "express"
import { create_doc, get_doc } from "./docs.js"

/**
 * Router for the express server.
 * @type {express.Router}
 */
export const router = express.Router()

/**
 * Handles the GET request for the home page.
 */
router.get("/", (_, res) => {
	res.render("home")
})

/**
 * Handles the POST request to create a new document.
 */
router.post("/new", async (_, res) => {
	const { doc, error } = await create_doc()
	if (error) {
		return res.render("error", error)
	}
	const doc_id = doc.public_id
	res.redirect(`/document/${doc_id}`)
})

/**
 * Handles the GET request for a specific document.
 */
router.get("/document/:id", async (req, res) => {
	const doc_id = req.params.id
	const { doc, error } = await get_doc(doc_id)
	if (error) {
		return res.render("error", error)
	}
	const { title, text } = doc
	res.render("document", { doc_id, title, text })
})

/**
 * Handles requests for non-supported routes.
 */
router.use((_, res) => {
	res.render("error", {
		status: 404,
		message: "This page could not be found",
	})
})
