const test = require('tape');
const jsdom = require('jsdom-global');

const frankenApp = require('../dist/franken-app.cjs');
const data = require('./data/listings.json');

function Listings(props) {
	return {
		el: 'div',
		children: [Actions(props), List(props)]
	};
}

function Actions({state, dispatch, actions}) {
	return {
		el: 'div',
		quirks: {style: 'margin: 1em; text-align: right;'},
		children: [
			{
				el: 'button#btnMore',
				quirks: {id: 'btnMore', style: 'margin: 0 0.5em;'},
				events: {click: () => {}},
				children: ['More']
			},
			{
				el: 'button#btnRestart',
				quirks: {style: 'margin: 0 0.5em;'},
				events: {click: () => actions.updateResults()},
				children: ['Restart']
			}
		]
	};
}

function List({state}) {
	return {
		el: 'ul',
		quirks: {style: 'list-style: none; margin: 1em; padding: 0;'},
		children: state.results.map(Link)
	};
}

function Link(data) {
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
			SubLink(data)
		]
	};
}

function SubLink({created, subreddit}) {
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

test('stress test', function(t) {
	const dispose = jsdom(`<div id='root'></div>`);

	frankenApp({
		id: 'root',
		func: Listings,
		state: {results: data.concat(data)},
		actions: {
			updateResults: () => state =>
				Object.assign({}, state, {
					results: state.results.concat(state.results)
				})
		}
	})();

	const event = document.createEvent('HTMLEvents');
	event.initEvent('click', true, true);

	t.equal(
		document.querySelector('#root ul').childElementCount,
		data.length * 2,
		'listings were rendered'
	);

	document.querySelector('#btnRestart').dispatchEvent(event);

	t.equal(
		document.querySelector('#root ul').childElementCount,
		data.length * 4,
		'listings were doubled'
	);

	dispose();
	t.end();
});

test('remove/replace/append test', function(t) {
	const dispose = jsdom(`<div id='root'></div>`);

	frankenApp({
		id: 'root',
		func: Listings,
		state: {results: data.slice(0, 5)},
		actions: {
			updateResults: () => state =>
				Object.assign({}, state, {
					results: data.slice(3, 8)
				})
		}
	})();

	const event = document.createEvent('HTMLEvents');
	event.initEvent('click', true, true);

	let links = document.querySelectorAll('#root ul li a');
	let listings = data.slice(0, 5);

	links.forEach(link => {
		t.ok(
			listings.some(y => link.innerHTML === y.title),
			'link matches listing title'
		);
	});

	document.querySelector('#btnRestart').dispatchEvent(event);

	links = document.querySelectorAll('#root ul li a');
	listings = data.slice(3, 8);

	links.forEach(link => {
		t.ok(
			listings.some(y => link.innerHTML === y.title),
			'link matches listing title'
		);
	});

	dispose();
	t.end();
});
