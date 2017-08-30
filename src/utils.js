const CREATE_NODE = 'CREATE_NODE';
const REMOVE_NODE = 'REMOVE_NODE';
const REPLACE_NODE = 'REPLACE_NODE';
const UPDATE_NODE = 'UPDATE_NODE';
const SET_QUIRK = 'SET_QUIRK';
const REMOVE_QUIRK = 'REMOVE_QUIRK';

export function diff(oldView, newView) {
  if (!oldView) return { type: CREATE_NODE, newView };
  if (!newView) return { type: REMOVE_NODE };
  if (changed(oldView, newView)) return { type: REPLACE_NODE, newView };
  if (newView.el) {
    return {
      type: UPDATE_NODE,
      children: diffChildren(oldView, newView),
      quirks: diffQuirks(oldView, newView)
    };
  }
}

function changed(oldView, newView) {
  return (
    typeof oldView !== typeof newView ||
    (typeof newView === 'string' && oldView !== newView) ||
    oldView.type !== newView.type
  );
}

function diffChildren(oldView, newView) {
  const patches = [];
  if (
    typeof oldView.children === 'string' ||
    typeof newView.children === 'string'
  ) {
    patches.push(diff(oldView.children, newView.children));
    return patches;
  }

  const length = Math.max(oldView.children.length, newView.children.length);
  for (let i = 0; i < length; i++) {
    patches.push(diff(oldView.children[i], newView.children[i]));
  }

  return patches;
}

function diffQuirks(oldView, newView) {
  const patches = [];
  const quirks = Object.assign({}, oldView.quirks, newView.quirks);
  Object.keys(quirks).forEach(key => {
    const oldVal = oldView.quirks[key];
    const newVal = newView.quirks[key];

    if (!newVal) {
      patches.push({ type: REMOVE_QUIRK, key, value: oldVal });
    } else if (!oldVal || oldVal !== newVal) {
      patches.push({ type: SET_QUIRK, key, value: newVal });
    }
  });
  return patches;
}

export function patch(parent, patches, index = 0) {
  if (!patches) return;

  const el =
    parent.childNodes[index] || parent.childNodes[parent.childNodes.length - 1];

  switch (patches.type) {
    case CREATE_NODE:
      parent.appendChild(createElement(patches.newView));
      break;
    case REMOVE_NODE:
      if (el) parent.removeChild(el);
      break;
    case REPLACE_NODE:
      parent.replaceChild(createElement(patches.newView), el);
      break;
    case UPDATE_NODE:
      const { children, quirks } = patches;
      quirks.forEach(patchQuirk.bind(null, el));
      for (let i = 0, l = children.length; i < l; i++) {
        patch(el, children[i], i);
      }
      break;
    default:
      break;
  }
}

function patchQuirk(el, patch) {
  switch (patch.type) {
    case SET_QUIRK:
      el.setAttribute(patch.key, patch.value);
      break;
    case REMOVE_QUIRK:
      el.removeAttribute(patch.key);
      break;
  }
}

export function createElement(view) {
  if (!view.el) return document.createTextNode(view);

  const node = document.createElement(view.el);
  setQuirks(node, view.quirks);
  normalizeChildren(view.children)
    .map(createElement)
    .forEach(node.appendChild.bind(node));
  return node;
}

function setQuirks(node, quirks) {
  if (!quirks) return;
  Object.keys(quirks).forEach(key => {
    node.setAttribute(key, quirks[key]);
  });
}

export function normalizeChildren(children) {
  return Array.isArray(children) ? children : [children];
}
