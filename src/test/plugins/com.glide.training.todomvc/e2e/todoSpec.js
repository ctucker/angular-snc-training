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

	this.getFooter = function() {
		return element(by.css('#footer'));
	};

	this.getIncompleteItemString = function() {
		return element(by.css('#todo-count')).getText();
	};

	this.getClearCompletedButton = function() {
		return element(by.css('#clear-completed'));
	};

	this.toggleCompletionOfEntry = function(idx) {
		this.todoEntries.get(idx).$('input.toggle').click();
	};

	this.clearCompleted = function() {
		this.getClearCompletedButton().click();
	};

	this.deleteEntry = function(idx) {
		var toDelete = this.getEntry(idx);
		var deleteButton = toDelete.$('button.destroy');
		browser.actions()
			.mouseMove(toDelete)
			.perform();
		deleteButton.click();
	};

	this.showActive = function() {
		element(by.css('#filters a[href="#/active"]')).click();
	};

	this.showCompleted = function() {
		element(by.css('#filters a[href="#/completed"]')).click();
	}
};

describe('todo list homepage', function() {
	var todoListPage;

	beforeEach(function() {
		todoListPage = new TodoListPage();
		todoListPage.get();
	});

	describe('adding a todo entry', function() {
		it('adds a new entry to the end of the list', function() {
			todoListPage.addTodo("My new todo entry");
			expect(todoListPage.getLastEntry().getText()).toEqual("My new todo entry");
		});

		it('adds multiple entries to the list', function() {
			todoListPage.addTodo("My first todo");
			todoListPage.addTodo("My second todo");
			expect(todoListPage.getEntry(0).getText()).toEqual("My first todo");
			expect(todoListPage.getEntry(1).getText()).toEqual("My second todo");
		});
	});

	describe('toggling completion', function() {
		beforeEach(function() {
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
		});

	});

	describe('deleting a todo', function() {
		it('deletes a task when the red x is clicked on', function() {
			todoListPage.addTodo("To delete");
			todoListPage.deleteEntry(0);
			expect(todoListPage.getAllEntries().count()).toBe(0);
		});
	});

	describe('managing the footer', function() {
		it('hides the footer when there are no tasks', function() {
			expect(todoListPage.getFooter().getAttribute('class')).toContain('ng-hide');
		});

		it('shows the footer when a task is added', function() {
			todoListPage.addTodo("First todo");
			expect(todoListPage.getFooter().getAttribute('class')).not.toContain('ng-hide');
		});
	});

	describe('displaying items left', function() {
		it('shows a single incomplete item with correct pluralization', function() {
			todoListPage.addTodo('My todo');
			expect(todoListPage.getIncompleteItemString()).toEqual('1 item left');
		});

		it('shows a two incomplete items with correct pluralization', function() {
			todoListPage.addTodo('First todo');
			todoListPage.addTodo('Second todo');
			expect(todoListPage.getIncompleteItemString()).toEqual('2 items left');
		});
	});

	describe('clearing completed items', function() {
		it('does not show the clear completed items button when there are only incomplete items in the list', function() {
			todoListPage.addTodo('Incomplete todo');
			expect(todoListPage.getClearCompletedButton().isDisplayed()).toBeFalsy();
		});

		it('shows the clear completed items button when there are completed items in the list', function() {
			todoListPage.addTodo('Completed todo');
			todoListPage.toggleCompletionOfEntry(0);
			expect(todoListPage.getClearCompletedButton().isDisplayed()).toBeTruthy();
		});

		it('removes all completed items when the completed items button is clicked', function() {
			todoListPage.addTodo('Completed todo');
			todoListPage.addTodo('Incomplete todo');
			todoListPage.toggleCompletionOfEntry(0);
			todoListPage.clearCompleted();
			expect(todoListPage.getEntry(0).getText()).toEqual('Incomplete todo');
		});
	});

	describe('filtering entries', function() {

		beforeEach(function() {
			todoListPage.addTodo('Completed todo');
			todoListPage.addTodo('Incomplete todo');
			todoListPage.toggleCompletionOfEntry(0);
		});

		it('shows shows only incomplete entries when viewing "active" set', function() {
			todoListPage.showActive();
			expect(todoListPage.getEntry(0).getText()).toEqual('Incomplete todo');
		});

		it('shows only complete entries when viewing "completed" set"', function() {
			todoListPage.showCompleted();
			expect(todoListPage.getEntry(0).getText()).toEqual('Completed todo');
			expect(todoListPage.getAllEntries().count()).toEqual(1);
		})
	});

});