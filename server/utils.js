import path from "path"
import { fileURLToPath } from "url"
import { nanoid } from "nanoid"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const resolve_path = (...paths) => path.resolve(__dirname, ...paths)

export function generate_ID() {
	return nanoid(10)
}
