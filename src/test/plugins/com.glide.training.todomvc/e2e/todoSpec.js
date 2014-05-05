"use strict";

var TodoListPage = function() {
	this.todoInput = element(by.css('#new-todo'));

	this.get = function() {
		browser.get('/$todo.do');
	};

	this.addTodo = function(todoTitle) {
		this.todoInput.clear();
		this.todoInput.sendKeys(todoTitle);
		this.todoInput.submit();
	};

	this.getLastEntry = function() {
		return element(by.css('#todo-list li:last-child'));
	};

	this.getEntry = function(rowNumber) {
		return element(by.repeater('task in taskList').row(rowNumber))
	}
};

describe('todo list homepage', function() {
	var todoListPage;

	beforeEach(function() {
		todoListPage = new TodoListPage();
	});

	it('loads the $todo page successfully', function() {
		todoListPage.get();
	});

	describe('adding a todo entry', function() {
		it('adds a new entry to the end of the list', function() {
			todoListPage.get();
			todoListPage.addTodo("My new todo entry");
			expect(todoListPage.getLastEntry().getText()).toEqual("My new todo entry");
		});

		it('adds multiple entries to the list', function() {
			todoListPage.get();
			todoListPage.addTodo("My first todo");
			todoListPage.addTodo("My second todo");
			expect(todoListPage.getEntry(0).getText()).toEqual("My first todo");
			expect(todoListPage.getEntry(1).getText()).toEqual("My second todo");
		});
	});
});