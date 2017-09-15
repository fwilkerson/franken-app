const test = require('tape');
const jsdom = require('jsdom-global');

const frankenApp = require('../dist');

const updateMessage = message => state => Object.assign({}, state, {message});
const addMessage = state =>
	Object.assign({}, state, {message: '', messages: [state.message]});
const removeMessage = id => state =>
	Object.assign({}, state, {
		messages: state.messages.filter((x, i) => i !== id)
	});

const input = props => ({
	el: 'input',
	quirks: {
		id: 'message',
		type: 'text',
		value: props.state.message
	},
	events: {
		input: e => props.dispatch(updateMessage(e.target.value)),
		keydown: e => props.dispatch(addMessage)
	}
});

const li = dispatch => (message, i) => ({
	el: 'li',
	quirks: {id: `message-${i}`},
	events: {click: () => dispatch(removeMessage(i))},
	children: [message]
});

const view = props => ({
	el: 'div',
	children: [
		{el: 'h2', children: [props.state.message]},
		input(props),
		{el: 'ul', children: props.state.messages.map(li(props.dispatch))}
	]
});

test('input event test', t => {
	const dispose = jsdom(`<div id='root'></div>`);
	const event = document.createEvent('HTMLEvents');
	event.initEvent('input', true, true);

	frankenApp({
		id: 'root',
		func: view,
		state: {message: 'Hello, World!', messages: []}
	})();

	t.equal(
		document.querySelector('#root h2').innerHTML,
		'Hello, World!',
		'initial state rendered'
	);

	const input = document.querySelector('#root input');

	input.value = 'Updated';
	input.dispatchEvent(event);

	t.equal(
		document.querySelector('#root h2').innerHTML,
		'Updated',
		'updated state rendered'
	);

	const keydownEvent = document.createEvent('HTMLEvents');
	keydownEvent.initEvent('keydown', true, true);

	document.querySelector('#message').dispatchEvent(keydownEvent);

	t.equal(
		document.querySelector('#root input').value,
		'',
		'message input was cleared'
	);

	t.equal(
		document.querySelector('#root ul').children[0].innerHTML,
		'Updated',
		'message was added to the list'
	);

	const clickEvent = document.createEvent('HTMLEvents');
	clickEvent.initEvent('click', true, true);

	const message = document.querySelector('#root li');

	message.dispatchEvent(clickEvent);

	t.equal(
		document.querySelector('#root ul').children.length,
		0,
		'click event was patched and message was removed'
	);

	dispose();
	t.end();
});
