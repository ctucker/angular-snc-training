"use strict";

var TodoListPage = function() {
	this.todoInput = element(by.css('#new-todo'));
	this.lastEntry = element(by.css('#todo-list > li:last-child'));
	this.todoEntries = element.all(by.repeater('task in taskList'));

	this.get = function() {
		browser.get('/$todo.do');
	};

	this.addTodo = function(todoTitle) {
		this.todoInput.clear();
		this.todoInput.sendKeys(todoTitle);
		this.todoInput.submit();
	};

	this.toggleCompletionOfEntry = function(idx) {
		this.getEntry(idx).$('input.toggle').click();
	};

	this.deleteEntry = function(idx) {
		browser.actions().
			mouseMove(this.getEntry(idx)).
			perform();
		this.getEntry(idx).$('button.destroy').click();
	};

	this.getEntries = function() {
		return this.todoEntries;
	};

	this.getEntry = function(idx) {
		return this.todoEntries.get(idx);
	};

	this.getLastEntry = function() {
		return this.lastEntry;
	};

	this.getFooter = function() {
		return element(by.css('#footer'));
	};

};

describe('todo list homepage', function() {

	var todoListPage;
	beforeEach(function() {
		todoListPage = new TodoListPage();
		todoListPage.get();
	});

	describe('adding an entry', function() {

		it('adds a new entry at the end of the list when user types into input box', function () {
			todoListPage.addTodo("My new todo");
			expect(todoListPage.getLastEntry().getText()).toEqual("My new todo");
		});

		it('adds multiple entries to the list one after another', function () {
			todoListPage.addTodo("My first todo");
			todoListPage.addTodo("My second todo");
			expect(todoListPage.getEntry(0).getText()).toEqual("My first todo");
			expect(todoListPage.getEntry(1).getText()).toEqual("My second todo");
		});
	});

	describe('toggling completion status', function() {
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
			todoListPage.toggleCompletionOfEntry(0);
			expect(todoListPage.getEntry(0).getAttribute('class')).not.toContain('completed');
		});
	});

	describe('deleting a task', function() {

		it('deletes a task when the delete button is clicked', function() {
			todoListPage.addTodo("To delete");
			todoListPage.deleteEntry(0);
			expect(todoListPage.getEntries().count()).toBe(0);
		});

	});

	describe('conditionally showing the footer', function() {
		it('hides the footer by default', function() {
			expect(todoListPage.getFooter().isDisplayed()).toBeFalsy();
		});

		it('shows the footer when there are entries in the list', function() {
			todoListPage.addTodo("My todo");
			expect(todoListPage.getFooter().isDisplayed()).toBeTruthy();
		});
	});

});