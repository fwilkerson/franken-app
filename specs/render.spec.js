const test = require('tape');
const jsdom = require('jsdom-global');

const frankenApp = require('../dist');

const view = props => ({
	el: 'div',
	quirks: {class: 'container'},
	children: [
		{el: 'h2', quirks: {class: 'heading'}, children: ['view']},
		{el: 'p', children: ['object notation view functions']}
	]
});

test('rendering test', t => {
	const dispose = jsdom(`<div id='root'></div>`);
	frankenApp({id: 'root', func: view})();
	t.ok(document.querySelector('.container'), 'container was rendered');
	t.ok(document.querySelector('.heading'), 'heading was rendered');
	t.ok(document.querySelector('.container > p'), 'paragraph was rendered');
	dispose();
	t.end();
});
