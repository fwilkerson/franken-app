import { getEventMap, listenForEvents } from './events';
import { createElement, diff, patch } from './utils';

export default function() {
  let _state;
  let _target;
  let _func;
  let _actions;
  let _view;
  let _eventMap;

  // TODO: Patch events, add/remove event listeners

  function render(view, target) {
    _eventMap = getEventMap(view);
    listenForEvents(_eventMap, target);
    target.appendChild(createElement(view));
  }

  function update(view) {
    const patches = diff(_view, view);
    patch(_target, patches);
    _view = view;
  }

  function dispatch(updateFunc) {
    _state = updateFunc(_state);
    update(_func({ actions: _actions, state: _state, dispatch }));
  }

  return {
    init({ el, func, state, actions }) {
      _target = document.getElementById(el);
      _func = func;
      _state = state || {};
      _actions = actions || {};
      _view = func({ actions, state, dispatch });
      render(_view, _target);
    }
  };
}
