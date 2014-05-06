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

	this.toggleCompletionOfEntry = function(idx) {
		this.getEntry(idx).element(by.css('input.toggle')).click();
	};

	this.getEntry = function(idx) {
		return element(by.repeater('task in taskList').row(idx));
	};

	this.getLastEntry = function() {
		return this.lastEntry;
	}
};

describe('todo list homepage', function() {

	var todoListPage;
	beforeEach(function() {
		todoListPage = new TodoListPage();
		todoListPage.get();
	});

	describe('adding an entry', function() {

		it('adds a new entry at the end of the list when user types into input box', function() {
			todoListPage.addTodo("My new todo");
			expect(todoListPage.getLastEntry().getText()).toEqual("My new todo");
		});

		it('adds multiple entries to the list one after another', function() {
			todoListPage.addTodo("My first todo");
			todoListPage.addTodo("My second todo");
			expect(todoListPage.getEntry(0).getText()).toEqual("My first todo");
			expect(todoListPage.getEntry(1).getText()).toEqual("My second todo");
		});

		it('starts out in an incomplete state', function() {
			todoListPage.addTodo("Incomplete todo");
			expect(todoListPage.getEntry(0).getAttribute('class')).not.toContain('completed');
		});

		it('updates to a completed state when checkbox is checked', function() {
			todoListPage.addTodo("Completed todo");
			todoListPage.toggleCompletionOfEntry(0);
			expect(todoListPage.getEntry(0).getAttribute('class')).toContain('completed');
		});

		it('updates to an incomplete state when checkbox is unchecked', function() {
			todoListPage.addTodo("Incomplete todo");
			todoListPage.toggleCompletionOfEntry(0);
			todoListPage.toggleCompletionOfEntry(0)
			expect(todoListPage.getEntry(0).getAttribute('class')).not.toContain('completed');
		})
	});
});