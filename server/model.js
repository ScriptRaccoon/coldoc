import mongoose from "mongoose"
import { nanoid } from "nanoid"

/**
 * Schema for a document.
 * @type {mongoose.Schema<any>}
 */
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

/**
 * Model for a document.
 * @type {mongoose.Model<any>}
 */
export const doc_model = mongoose.model("document", doc_schema)
