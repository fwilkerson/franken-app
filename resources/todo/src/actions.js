const assign = (...args) => Object.assign({}, ...args);

const setTodos = ({todos, todo}) => [...todos, {text: todo, complete: false}];
const addTodo = state => ({todo: '', todos: setTodos(state)});

const setComplete = todo => assign(todo, {complete: !todo.complete});
const toggleTodo = ({todos}, id) => ({
	todos: todos.map((todo, i) => (i === id ? setComplete(todo) : todo))
});

export default {
	update: todo => state => assign(state, {todo}),
	add: () => state => assign(state, addTodo(state)),
	toggle: id => state => assign(state, toggleTodo(state, id))
};
