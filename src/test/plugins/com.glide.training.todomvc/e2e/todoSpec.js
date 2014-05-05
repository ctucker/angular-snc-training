var TodoListPage = function() {
	this.todoInput = element(by.css('#new-todo'));

	this.get = function() {
		browser.get('/$todo.do');
	};

	this.addTodo = function(todoTitle) {
		this.todoInput.sendKeys(todoTitle);
		this.todoInput.submit();
	};

	this.getLastEntry = function() {
		return element(by.css('#todo-list li:last-child'));
	}
};

describe('todo list homepage', function() {
	it('loads the $todo page successfully', function() {
		new TodoListPage().get();
	});

	describe('adding a todo entry', function() {
		it('adds a new entry to the end of the list', function() {
			var todoListPage = new TodoListPage();
			todoListPage.get();
			todoListPage.addTodo("My new todo entry");
			expect(todoListPage.getLastEntry().getText()).toEqual("My new todo entry");
		});
	});
});