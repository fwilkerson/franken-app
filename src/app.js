import {createElement, diff, diffEventMap, getEventMap, patch} from './utils';

function frankenApp({id, func, state, actions}) {
  let _view;
  let _eventMap;

  let _target = document.getElementById(id);
  let _func = func;
  let _state = state || {};
  let _actions = {};
  Object.keys(actions || {}).forEach(key => {
    _actions[key] = (...args) => dispatch(actions[key](...args));
  });

  function render(view, target) {
    _eventMap = getEventMap(view);
    listenForEvents(_eventMap, target);
    target.appendChild(createElement(view));
  }

  function update(view) {
    const eventMap = getEventMap(view);
    const eventPatches = diffEventMap(_eventMap, eventMap);
    listenForEvents({uniqueEvents: eventPatches}, _target);

    const patches = diff(_view, view);
    patch(_target, patches);

    _eventMap = eventMap;
    _view = view;
  }

  function listenForEvents({uniqueEvents}, target) {
    uniqueEvents.forEach(event => {
      target.addEventListener(event, e => routeEvent(e, e.target));
    });
  }

  function routeEvent(e, target) {
    if (!target) return;

    const eventHandlers = _eventMap.events[target.id];
    if (eventHandlers && eventHandlers[e.type]) {
      return eventHandlers[e.type](e);
    }

    routeEvent(e, target.parentElement);
  }

  function dispatch(updateFunc) {
    _state = updateFunc(_state);
    update(_func({actions: _actions, state: _state, dispatch}));
  }

  return function() {
    _view = _func({actions: _actions, state: _state, dispatch});
    render(_view, _target);
  };
}

export default frankenApp;
