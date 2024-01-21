const TEN_YEARS = 1000 * 60 * 60 * 24 * 365 * 10

export function set_user(req, res, next) {
	const id = req.cookies.user_id ?? crypto.randomUUID()

	res.cookie("user_id", id, {
		httpOnly: true,
		maxAge: TEN_YEARS,
	})

	req.user = { id }

	next()
}
