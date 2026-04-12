module.exports = async function handler(req, res) {
	try {
		const prefix = '/api/dogapi';
		const { pathname } = new URL(req.url, 'http://localhost');
		const resourcePath = decodeURIComponent(
			pathname.slice(prefix.length).replace(/^\/+/, '')
		);

		const { path: _, ...query } = req.query;
		const qs = new URLSearchParams(query).toString();
		const url = `https://api.thedogapi.com/v1/${resourcePath}${qs ? `?${qs}` : ''}`;

		const headers = {};
		if (process.env.DOGAPI_KEY) headers['x-api-key'] = process.env.DOGAPI_KEY;

		const response = await fetch(url, { headers });

		res.status(response.status);
		res.setHeader('content-type', response.headers.get('content-type') || 'application/json');

		const paginationCount = response.headers.get('pagination-count');
		if (paginationCount) res.setHeader('pagination-count', paginationCount);

		res.send(await response.text());
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error', message: err.message });
	}
};
