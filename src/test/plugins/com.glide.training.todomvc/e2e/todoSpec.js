"use strict";

var TodoListPage = function() {
	this.todoInput = element(by.css('#new-todo'));
	this.lastEntry = element(by.css('#todo-list > li:last-child'));

	this.get = function() {
		browser.get('/$todo.do');
	};

	this.addTodo = function(todoTitle) {
		this.todoInput.sendKeys(todoTitle);
	};

	this.getLastEntry = function() {
		return this.lastEntry;
	}
};

describe('todo list homepage', function() {
	it('loads the $todo page successfully', function() {
		new TodoListPage().get();
	});

	describe('adding an entry', function() {

		it('adds a new entry at the end of the list when user types into input box', function() {
			var todoListPage = new TodoListPage();
			todoListPage.get();
			todoListPage.addTodo("My new todo");
			expect(todoListPage.getLastEntry().getText()).toEqual("My new todo");
		});

	});
});