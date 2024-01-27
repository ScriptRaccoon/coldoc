import path from "path"
import { fileURLToPath } from "url"

/**
 * The directory name of the current module.
 * This is a workaround for the absence of __dirname in ES modules.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Resolves a path relative to the current module.
 * @param {string[]} paths - The path segments to join.
 * @returns {string} The resolved path.
 */
export const resolve_path = (...paths) => path.resolve(__dirname, ...paths)
