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
	it('should allow for text entry in the todo input', function() {
		var todoListPage = new TodoListPage();
		todoListPage.get();

		todoListPage.addTodo("new title");

		expect(todoListPage.todoInput.getAttribute('value')).toEqual("new title");
	});
});