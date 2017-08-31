import frankenApp from '../../../dist/index.min.js';

const updateMessage = (e, state) =>
  Object.assign({}, state, { message: e.target.value });

const input = props => ({
  el: 'input',
  quirks: {
    id: 'message',
    type: 'text',
    value: props.state.message
  },
  events: {
    input: e => props.dispatch(state => updateMessage(e, state))
  },
  children: []
});

const view = props => ({
  el: 'div',
  children: [{ el: 'h2', children: [props.state.message] }, input(props)]
});

frankenApp({
  id: 'root',
  func: view,
  state: { message: 'Hello, World!' }
})();
