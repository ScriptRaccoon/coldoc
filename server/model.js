import mongoose from "mongoose"
import { nanoid } from "nanoid"

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
		public_id: {
			type: String,
			default: () => nanoid(10),
			unique: true,
		},
	},
	{
		timestamps: true,
	}
)

export const doc_model = mongoose.model("document", doc_schema)
