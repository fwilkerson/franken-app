const test = require('tape');
const jsdom = require('jsdom-global');

const frankenApp = require('../dist/franken-app.cjs');

const count = length => {
	return new Array(length).fill('*');
};

const counter = ({state, dispatch}) => ({
	el: 'div.container#divContainer',
	events: {mouseover: () => {}},
	children: [
		{
			el: 'h4',
			quirks: {class: `counter-${state.count}`},
			children: count(state.count)
		},
		{
			el: 'button#btnIncrement',
			events: {
				click: () =>
					dispatch(state =>
						Object.assign({}, state, {count: state.count + 1})
					)
			},
			children: ['Increment']
		}
	]
});

test('update test', t => {
	const dispose = jsdom(`<div id='root'></div>`);
	const event = document.createEvent('HTMLEvents');
	event.initEvent('click', true, true);

	frankenApp({id: 'root', func: counter, state: {count: 1}})();

	t.equal(
		document.querySelector(`.counter-1`).innerHTML.length,
		1,
		'# of stars is 1'
	);

	document.querySelector('#btnIncrement').dispatchEvent(event);
	t.equal(
		document.querySelector(`.counter-2`).innerHTML.length,
		2,
		'# of stars is 2'
	);

	document.querySelector('#btnIncrement').dispatchEvent(event);
	t.equal(
		document.querySelector(`.counter-3`).innerHTML.length,
		3,
		'# of stars is 3'
	);

	dispose();
	t.end();
});
