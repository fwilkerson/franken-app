import frankenApp from '../../../dist/franken-app.js';

const updateMessage = message => state => Object.assign({}, state, {message});

const input = props => ({
	el: 'input',
	quirks: {
		id: 'message',
		type: 'text',
		value: props.state.message
	},
	events: {
		input: e => props.dispatch(updateMessage(e.target.value))
	},
	children: []
});

const view = props => ({
	el: 'div',
	children: [{el: 'h2', children: [props.state.message]}, input(props)]
});

frankenApp({
	id: 'root',
	func: view,
	state: {message: 'Hello, World!'}
})();
