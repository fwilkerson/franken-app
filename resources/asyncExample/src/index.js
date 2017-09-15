import frankenApp from '../../../dist/index.min.js';
import {loadData} from './api.js';

loadData().then(results => {
	frankenApp({
		id: 'root',
		func: view,
		state: {results}
	})();
});

function view(props) {
	return {
		el: 'div',
		children: [actions(props), list(props)]
	};
}

const updateResults = results => state => Object.assign({}, state, {results});

function actions({state, dispatch}) {
	return {
		el: 'div',
		quirks: {style: 'margin: 1em; text-align: right;'},
		children: [
			{
				el: 'button',
				quirks: {id: 'btnMore', style: 'margin: 0 0.5em;'},
				events: {
					click: () => {
						loadData(true).then(results =>
							dispatch(updateResults(results))
						);
					}
				},
				children: ['More']
			},
			{
				el: 'button',
				quirks: {id: 'btnRestart', style: 'margin: 0 0.5em;'},
				events: {
					click: () => {
						loadData().then(results =>
							dispatch(updateResults(results))
						);
					}
				},
				children: ['Restart']
			}
		]
	};
}

function list({state}) {
	return {
		el: 'ul',
		quirks: {style: 'list-style: none; margin: 1em; padding: 0;'},
		children: state.results.map(link)
	};
}

function link(data) {
	return {
		el: 'li',
		quirks: {
			style: 'margin: 0.5em 0; padding: 0.5em; border: 0.5px solid #777;'
		},
		children: [
			{
				el: 'a',
				quirks: {href: data.url, target: '_blank'},
				children: [data.title]
			},
			subLink(data)
		]
	};
}

function subLink({created, subreddit}) {
	const createDate = new Date(0);
	createDate.setSeconds(created);
	return {
		el: 'div',
		quirks: {style: 'margin-top: 0.25em;'},
		children: [
			`r/${subreddit}`,
			{
				el: 'span',
				quirks: {style: 'margin-left: 0.5em;'},
				children: [`(${createDate.toLocaleDateString()})`]
			}
		]
	};
}
