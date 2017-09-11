# franken-app

An exercise to better understand the challenges of building a modern web application.
* Views are functions that return javascript objects
* State is represented by a single object
* Actions are dispatched to update state and trigger a re-render.

*Disclaimer, this project is little more than a thought experiment. It is likely bug ridden, definitely feature incomplete, and most certainly inefficent. Do not attempt to use it in a production application.*

## Simple example

```javascript
const updateMessage = message => state => Object.assign({}, state, {message});

const input = props => ({
  el: 'input',
  quirks: {id: 'message', type: 'text', value: props.state.message},
  events: {input: e => props.dispatch(updateMessage(e.target.value))},
  children: []
});

const view = props => ({
  el: 'div',
  children: [{el: 'h2', children: [props.state.message]}, input(props)]
});

frankenApp({
  id: 'root',
  func: view,
  state: {message: 'Hello, World!'}
})();
```

## Describing markup

HTML is described with a javascript object. The object has four properties, two of which are required.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| el | string | The type of html element | true | &nbsp; |
| children | array | The child nodes of the element expressed as strings or objects | true | &nbsp; |
| quirks | object | Attributes the element may have e.g. class, id, style, etc | false | &nbsp; |
| events | object | A key value pair of event name and handler function | false | &nbsp; |

### More on events

The event system currently requires the element listening for the event have an id. Events are based on the event type, learn more here https://developer.mozilla.org/en-US/docs/Web/API/Event/type.

## Creating an app

The default export of franken-app is a function that takes a configuration object and returns a function that when invoked renders the application. The configuration object given to franken-app has the following properties.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string | The id of the element where you want the app injected | true | &nbsp; |
| func | function | The root function that describes your application | true | &nbps; |
| state | any | Any state the application may have | false | &nbps; |
| actions | object | functions that manipulate application state | false | &nbps; |

### More on actions

In the simple example above the updateMessage function is being dispatched when the input received an input event. Functions given to the actions object take care of the dispatching for you. This allows you to simply call the action.

```javascript
const input = ({actions, state}) => ({
  el: 'input',
  quirks: {id: 'message', type: 'text', value: state.message},
  events: {input: e => actions.updateMessage(e.target.value)},
  children: []
});

...

frankenApp({
  id: 'root',
  func: view,
  state: {message: 'Hello, World!'},
  actions: {
    updateMessage: message => state => Object.assign({}, state, {message})
  }
})();
```

## Virtual DOM

A primitive virtual DOM is used to attempt to give efficient re-renders. The first iteration of this experiment built a string & set the innertHTML of the root element. Each render became noticeable when a large number of elements were added to the screen. The addition of the virtual DOM fixed this, but it is by no means complete or as sophisticated as a true virtual DOM.

## Small footprint

A minified gzipped version of franken-app is 1.9kb. The goal with franken-app was to stick with the basics and give the minimum feature set other libraries give. The small footprint is due to a tight coupling of the renderer with the DOM, no synthetic events, and a lack of lifecycle hooks.

## Learn More

Check out the resources folder for sample applications. You can easily run the the todo sample if you have Chrome 61 or higher (or any browser with ecmascript modules enabled). After cloning franken-app cd in the resources/todo folder and run an http-server. Other samples may require you to install depedencies and build the source of franken-app.