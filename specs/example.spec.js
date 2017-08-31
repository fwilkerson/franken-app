const test = require('tape');
const jsdom = require('jsdom-global');

const frankenApp = require('../dist');

const updateMessage = (e, state) =>
  Object.assign({}, state, { message: e.target.value });

const input = ({ state, dispatch }) => ({
  el: 'input',
  quirks: {
    id: 'message',
    type: 'text',
    value: state.message
  },
  events: {
    input: e => dispatch(updateMessage(e, state))
  }
});

const view = props => ({
  el: 'div',
  children: [{ el: 'h2', children: [props.state.message] }, input(props)]
});

test('rendering test', t => {
  const dispose = jsdom(`<div id='root'></div>`);
  frankenApp({ el: 'root', func: view, state: { message: 'Hello, World!' } })();

  t.ok(document.querySelector('#message'), 'input was rendered');

  // const event = document.createEvent('HTMLEvents');
  // event.initEvent('click', true, true);

  dispose();
  t.end();
});
