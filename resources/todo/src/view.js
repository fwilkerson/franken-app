const view = ({actions, state}) => ({
	el: 'div',
	children: [
		{el: 'h1', children: ['todo']},
		input('todo', state.todo, actions.update, actions.add),
		todoList(state.todos, actions.toggle)
	]
});

const input = (id, value, onInput, onSubmit) => ({
	el: 'input',
	quirks: {id, type: 'text', value},
	events: {
		input: e => onInput(e.target.value),
		keydown: e => e.keyCode === 13 && onSubmit()
	}
});

const todoList = (todos, onClick) => ({
	el: 'ul',
	children: todos.map(todoItem(onClick))
});

const todoItem = onClick => (todo, i) => ({
	el: 'li',
	quirks: {class: todo.complete ? 'complete' : ''},
	children: [
		{
			el: `a#todo-${i}`,
			events: {click: () => onClick(i)},
			children: [todo.text]
		}
	]
});

export default view;
