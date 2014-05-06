"use strict";

var TodoListPage = function() {
	this.todoInput = element(by.css('#new-todo'));
	this.lastEntry = element(by.css('#todo-list > li:last-child'));

	this.get = function() {
		browser.get('/$todo.do');
	};

	this.addTodo = function(todoTitle) {
		this.todoInput.clear();
		this.todoInput.sendKeys(todoTitle);
		this.todoInput.submit();
	};

	this.getEntry = function(idx) {
		return element(by.repeater('task in taskList').row(idx));
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

		it('adds multiple entries to the list one after another', function() {
			var todoListPage = new TodoListPage();
			todoListPage.get();
			todoListPage.addTodo("My first todo");
			todoListPage.addTodo("My second todo");
			expect(todoListPage.getEntry(0).getText()).toEqual("My first todo");
			expect(todoListPage.getEntry(1).getText()).toEqual("My second todo");
		});

	});
});