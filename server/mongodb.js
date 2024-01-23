import mongoose from "mongoose"

export async function connect_to_db() {
	try {
		await mongoose.connect(process.env.MONGODB_URI)
		console.info("Connected to MongoDB")
	} catch (err) {
		console.error("Could not connect to MongoDB", err)
	}
}
