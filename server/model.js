import mongoose from "mongoose"

const doc_schema = new mongoose.Schema({
	title: {
		type: String,
		default: "Untitled",
		required: true,
	},
	text: {
		type: String,
		default: "",
	},
})

export const doc_model = mongoose.model("document", doc_schema)