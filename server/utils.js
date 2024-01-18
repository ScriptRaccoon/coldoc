import path from "path"
import { fileURLToPath } from "url"
import { nanoid } from "nanoid"

/**
 * @type {string}
 * @description The current directory.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @param {string[]} paths
 * @returns {string}
 * @description Resolves the given paths relative to the current directory.
 */
export const resolve_path = (...paths) => path.resolve(__dirname, ...paths)

/**
 * @returns {string}
 * @description Generates a new ID.
 */
export function generate_ID() {
	return nanoid(10)
}
