var TodoListPage = function() {
	this.todoInput = element(by.css('#new-todo'));

	this.get = function() {
		browser.get('/$todo.do');
	};

	this.addTodo = function(todoTitle) {
		this.todoInput.sendKeys(todoTitle);
	};
};

describe('todo list homepage', function() {
	it('loads the $todo page successfully', function() {
		new TodoListPage().get();
	});
});