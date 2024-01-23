import path from "path"
import { fileURLToPath } from "url"

// necessary workaround for __dirname in esmodules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const resolve_path = (...paths) => path.resolve(__dirname, ...paths)
