# franken-app

An exercise to better understand the challenges of building a modern front end framework. Views are expressed as javascript objects. State is represented by a single object. The application is updated by dispatching functions that modify state.

```javascript
const updateMessage = (e, state) =>
    Object.assign({}, state, { message: e.target.value })

const input = (props) => ({
    el: 'input',
    quirks: {
        id: 'message',
        type: 'text',
        value: props.state.message
    },
    events: { 
        input: (e) => props.dispatch(state => updateMessage(e, state))
    },
    children: []
})

const view = (props) => ({
    el: 'div',
    children: [
        { el: 'h2', children: [props.state.message] },
        input(props)
    ]
})

frankenApp({
    el: 'root',
    func: view,
    state: { message: 'Hello, World!' }
})();
```

The event system currently requires the element listening for the event have an id. Events are based on the event type, leave more here https://developer.mozilla.org/en-US/docs/Web/API/Event/type.

Disclaimer, this project is little more than a thought experiment. It is bug ridden, feature incomplete, and inefficent. Do not attempt to use it to build a real application.