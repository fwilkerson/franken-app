import { normalizeChildren } from './utils';

export function getEventMap(view) {
  let events = {};
  let uniqueEvents = [];

  function mapEvents(view) {
    if (!view.el) return;

    if (view.events && view.quirks && view.quirks.id) {
      events[view.quirks.id] = view.events;
      uniqueEvents = uniqueEvents.concat(
        Object.keys(view.events).filter(key => {
          return !uniqueEvents.some(x => x === key);
        })
      );
    }

    normalizeChildren(view.children).forEach(mapEvents);
  }

  mapEvents(view);
  return { events, uniqueEvents };
}

export function listenForEvents({ events, uniqueEvents }, target) {
  uniqueEvents.forEach(event => {
    target.addEventListener(event, e => routeEvent(events, e.target, e.type));
  });
}

function routeEvent(events, target, type) {
  if (!target) return;

  const eventHandlers = events[target.id];
  if (eventHandlers && eventHandlers[type]) {
    return eventHandlers[type]();
  }

  routeEvent(target.parentElement, type);
}
