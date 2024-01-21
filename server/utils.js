import path from "path"
import { fileURLToPath } from "url"
import { nanoid } from "nanoid"
import { get_doc } from "./docs.js"

// necessary workaround for __dirname in esmodules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const resolve_path = (...paths) => path.resolve(__dirname, ...paths)

export const generate_ID = () => nanoid(10)

export const generate_recent_documents = (id_list) => {
	return id_list.map((id) => ({
		id,
		url: `/document/${id}`,
		title: get_doc(id)?.title ?? "Untitled Document",
	}))
}
