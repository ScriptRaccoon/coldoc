const ONE_YEAR = 1000 * 60 * 60 * 24 * 365

export function set_user(req, res, next) {
	const id = req.cookies.user_id ?? crypto.randomUUID()
	let recent_ids = []
	try {
		recent_ids = JSON.parse(req.cookies.recent_ids ?? "[]")
	} catch (err) {
		console.error(err)
	}
	res.cookie("user_id", id, {
		httpOnly: true,
		maxAge: ONE_YEAR,
	})
	req.user = { id, recent_ids }

	next()
}

export function set_recent_ids(req, res, next, limit = 10) {
	const doc_id = req.params.id
	const id_list = req.user?.recent_ids
	if (!doc_id || !id_list) return next()
	const new_list = [doc_id, ...id_list.filter((id) => id !== doc_id)]
	if (new_list.length > limit) {
		new_list.pop()
	}
	res.cookie("recent_ids", JSON.stringify(new_list), {
		httpOnly: true,
		maxAge: ONE_YEAR,
	})
	req.user.recent_ids = new_list

	next()
}
