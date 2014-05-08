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

	this.clearCompleted = function() {
		this.getClearCompletedButton().click();
	};

	this.toggleCompleteAll = function() {
		element(by.css('#toggle-all')).click();
	};

	this.showActive = function() {
		element(by.css('#filters a[href="#/active"]')).click();
	};

	this.showCompleted = function() {
		element(by.css('#filters a[href="#/completed"]')).click();
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

	this.getItemsLeft = function() {
		return element(by.css('#todo-count'));
	};

	this.getClearCompletedButton = function() {
		return element(by.css('#clear-completed'));
	};

	this.getCompletionStatusOf = function(idx) {
		return this.getEntry(idx).$('input[type="checkbox"]').getAttribute('checked');
	}

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

	describe('counting the remaining items', function() {

		it('shows 1 item left when there is a single, incomplete item in the list', function() {
			todoListPage.addTodo("One incomplete todo");
			expect(todoListPage.getItemsLeft().getText()).toEqual('1 item left');
		});

		it('shows 2 items left when there are two, incomplete items in the list', function() {
			todoListPage.addTodo("First incomplete todo");
			todoListPage.addTodo("Second incomplete todo");
			expect(todoListPage.getItemsLeft().getText()).toEqual('2 items left');
		});

	});

	describe('clearing completed items', function() {
		it('should not show the clear completed button when there are no completed items', function() {
			todoListPage.addTodo('Incomplete todo');
			expect(todoListPage.getClearCompletedButton().isDisplayed()).toBeFalsy();
		});

		it('shows the correct count on the button when there are completed items', function() {
			todoListPage.addTodo('Completed todo');
			todoListPage.addTodo('Second completed todo');
			todoListPage.toggleCompletionOfEntry(0);
			todoListPage.toggleCompletionOfEntry(1);
			expect(todoListPage.getClearCompletedButton().isDisplayed()).toBeTruthy();
			expect(todoListPage.getClearCompletedButton().getText()).toEqual("Clear completed (2)");
		});

		it('deletes completed tasks when the clear completed button is clicked', function() {
			todoListPage.addTodo('Completed todo');
			todoListPage.toggleCompletionOfEntry(0);
			todoListPage.clearCompleted();
			expect(todoListPage.getEntries().count()).toBe(0);
		});
	});

	describe('marking all items complete', function() {
		it('marks all items complete when complete-all chevron is checked', function() {
			todoListPage.addTodo('First todo');
			todoListPage.addTodo('Second todo');
			todoListPage.toggleCompleteAll();
			expect(todoListPage.getCompletionStatusOf(0)).toBeTruthy()
		})
	});

	describe('filtering which todos are shown', function() {
		beforeEach(function() {
			todoListPage.addTodo('First incomplete todo');
			todoListPage.addTodo('Complete todo');
			todoListPage.addTodo('Second incomplete todo');
			todoListPage.toggleCompletionOfEntry(1);
		});

		it('shows only incomplete todos when active link is clicked', function() {
			todoListPage.showActive();
			expect(todoListPage.getEntries().count()).toBe(2);
			expect(todoListPage.getEntry(1).getText()).toBe('Second incomplete todo')
		});

		it('shows only complete todos when completed link is clicked', function() {
			todoListPage.showCompleted();
			expect(todoListPage.getEntries().count()).toBe(1);
			expect(todoListPage.getEntry(0).getText()).toBe('Complete todo');
		});

	});

});