const uri = 'https://www.reddit.com/';
const lastIds = {};
const mapListing = listing =>
	new Promise(res => {
		const mapped = listing
			.filter(x => !x.data.domain.includes('self'))
			.map(x => ({
				id: `${x.kind}_${x.data.id}`,
				created: x.data.created,
				subreddit: x.data.subreddit,
				title: x.data.title,
				url: x.data.url
			}));

		const last = mapped[mapped.length - 1];
		lastIds[last.subreddit] = last.id;
		res(mapped);
	});

function getSubReddit(sub, more) {
	let queryString = '.json?limit=5';
	if (more) {
		const id = lastIds[sub.slice(sub.indexOf('/') + 1)];
		if (id) queryString = `.json?after=${id}&limit=5`;
	}

	return fetch(uri + sub + queryString)
		.then(resp => resp.json())
		.then(({data}) => mapListing(data.children))
		.catch(e => console.error(e));
}

export function loadData(more = false) {
	const queries = [];

	queries.push(getSubReddit('r/programming', more));
	queries.push(getSubReddit('r/funny', more));
	queries.push(getSubReddit('r/javascript', more));

	return Promise.all(queries).then(result => {
		return new Promise(res => res(result.reduce((x, y) => x.concat(y), [])));
	});
}
