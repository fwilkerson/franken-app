import frankenApp from '../lib/franken-app.js';

import actions from './actions.js';
import view from './view.js';

frankenApp({
  id: 'root',
  func: view,
  state: {todo: '', todos: []},
  actions
})();
