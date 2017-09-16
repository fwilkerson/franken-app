import frankenApp from '../lib/franken-app.js';

import actions from './actions.js';
import view from './view.js';

const dispatch = frankenApp({
	id: 'root',
	func: view,
	state: {todo: '', todos: []},
	actions,
	subscribe: (state, action) => console.log(state, action)
})();

dispatch(actions.update('Give the dispatcher to the people!'));
dispatch(actions.add());
dispatch(actions.toggle(0));
