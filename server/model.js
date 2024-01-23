import mongoose from "mongoose"

const doc_schema = new mongoose.Schema(
	{
		title: {
			type: String,
			default: "Untitled",
		},
		text: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
)

export const doc_model = mongoose.model("document", doc_schema)
