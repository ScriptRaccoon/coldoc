import mongoose from "mongoose"

/**
 * Connects to the MongoDB database.
 * @returns {Promise<void>}
 */
export async function connect_to_db() {
	try {
		const URI = process.env.MONGODB_URI
		if (!URI) throw new Error("No MongoDB URI provided")
		await mongoose.connect(URI)
		console.info("Connected to MongoDB")
	} catch (err) {
		console.error("Could not connect to MongoDB")
		console.error(err)
	}
}
