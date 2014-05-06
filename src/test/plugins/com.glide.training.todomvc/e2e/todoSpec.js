"use strict";

var TodoListPage = function() {
	this.todoInput = element(by.css('#new-todo'));
	this.todoEntries = element.all(by.repeater('task in taskList'));

	this.get = function() {
		browser.get('/$todo.do');
	};

	this.addTodo = function(todoTitle) {
		this.todoInput.clear();
		this.todoInput.sendKeys(todoTitle);
		this.todoInput.submit();
	};

	this.getLastEntry = function() {
		return this.todoEntries.last();
	};

	this.getEntry = function(rowNumber) {
		return this.todoEntries.get(rowNumber)
	};

	this.getAllEntries = function() {
		return this.todoEntries;
	};

	this.toggleCompletionOfEntry = function(idx) {
		this.todoEntries.get(idx).$('input.toggle').click();
	};

	this.deleteEntry = function(idx) {
		var toDelete = this.getEntry(idx);
		var deleteButton = toDelete.$('button.destroy');
		browser.actions()
			.mouseMove(toDelete)
			.perform();
		deleteButton.click();
	};
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

	describe('toggling completion', function() {
		beforeEach(function() {
			todoListPage.get();
			todoListPage.addTodo("My todo");
		});

		it('starts out in an incomplete state', function() {
			expect(todoListPage.getEntry(0).getAttribute('class')).not.toContain('completed');
		});

		it('sets the completed class on an entry when the checkmark is set', function() {
			todoListPage.toggleCompletionOfEntry(0);
			expect(todoListPage.getEntry(0).getAttribute('class')).toContain('completed');
		});

		it('unsets the completed class when the checkmark is unset', function() {
			todoListPage.toggleCompletionOfEntry(0);
			todoListPage.toggleCompletionOfEntry(0);
			expect(todoListPage.getEntry(0).getAttribute('class')).not.toContain('completed');
		})

	});

	describe('deleting a todo', function() {
		it('deletes a task when the red x is clicked on', function() {
			todoListPage.get();
			todoListPage.addTodo("To delete");
			todoListPage.deleteEntry(0);
			expect(todoListPage.getAllEntries().count()).toBe(0);
		})
	});
});