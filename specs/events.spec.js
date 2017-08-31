const test = require('tape');
const jsdom = require('jsdom-global');

const frankenApp = require('../dist');

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

test('input event test', t => {
  const dispose = jsdom(`<div id='root'></div>`);
  const event = document.createEvent('HTMLEvents');
  event.initEvent('input', true, true);

  frankenApp({
    id: 'root',
    func: view,
    state: { message: 'Hello, World!' }
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

  dispose();
  t.end();
});
