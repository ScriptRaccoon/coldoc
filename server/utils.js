import path from "path"
import { fileURLToPath } from "url"
import { nanoid } from "nanoid"

// necessary workaround for __dirname in esmodules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const resolve_path = (...paths) => path.resolve(__dirname, ...paths)

export const generate_ID = () => nanoid(10)
