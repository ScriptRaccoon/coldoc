const ONE_YEAR = 1000 * 60 * 60 * 24 * 365

export function set_user(req, res, next) {
	const id = req.cookies.user_id ?? crypto.randomUUID()
	let recent_docs = []
	try {
		recent_docs = JSON.parse(req.cookies.recent_docs ?? "[]")
	} catch (err) {
		console.error(err)
	}
	res.cookie("user_id", id, {
		httpOnly: true,
		maxAge: ONE_YEAR,
	})
	req.user = { id, recent_docs }

	next()
}

export function update_recent_docs(req, res, id, title) {
	const other_docs = req.user.recent_docs.filter((doc) => doc.id !== id)
	req.user.recent_docs = [{ id, title }, ...other_docs].slice(0, 10)
	res.cookie("recent_docs", JSON.stringify(req.user?.recent_docs ?? []), {
		httpOnly: true,
		maxAge: ONE_YEAR,
	})
}
