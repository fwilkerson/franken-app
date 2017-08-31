import { createElement, diff, getEventMap, patch } from './utils';

// Consider requiring children be an array like elm does

function frankenApp({ id, func, state, actions }) {
  let _view;
  let _eventMap;

  let _target = document.getElementById(id);
  let _func = func;
  let _state = state || {};
  let _actions = actions || {};

  function render(view, target) {
    _eventMap = getEventMap(view);
    listenForEvents(_eventMap, target);
    target.appendChild(createElement(view));
  }

  function update(view) {
    _eventMap = getEventMap(view);
    const patches = diff(_view, view);
    patch(_target, patches);
    _view = view;
  }

  // TODO: Patch event listeners on update
  function listenForEvents({ events, uniqueEvents }, target) {
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
    update(_func({ actions: _actions, state: _state, dispatch }));
  }

  return function() {
    _view = _func({ actions: _actions, state: _state, dispatch });
    render(_view, _target);
  };
}

export default frankenApp;
