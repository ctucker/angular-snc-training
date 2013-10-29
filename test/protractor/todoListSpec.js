(function() {
	'use strict';

	describe('Managing the todo list', function() {

		var ptor;

		beforeEach(function() {
			ptor = protractor.getInstance();
		});

		function getItems() {
			return ptor.findElements(byCss('#todo-list > li'));
		}

		it('should add a new item to the list', function() {
			ptor.get('/');

			var taskInput = findElement('#new-todo');

			// Type something in, and make sure it doesn't immediately reflect
			taskInput.sendKeys("new todo item");
			getItems().then(function(items) {
				expect(items.length).toBe(0);
			});

			// Submit the input and check that the result is now updated
			taskInput.submit();
			getItems().then(function(items) {
				expect(items[0].getText()).toEqual("new todo item");
			});
		});

		it('should add multiple items to the list in order', function() {
			ptor.get('/');

			var taskInput = findElement('#new-todo');

			taskInput.sendKeys("Item 1");
			taskInput.submit();

			taskInput.clear();
			taskInput.sendKeys("Item 2");
			taskInput.submit();

			getItems().then(function(items) {
				expect(items[0].getText()).toEqual('Item 1');
				expect(items[1].getText()).toEqual('Item 2');
				expect(items.length).toEqual(2);
			});
		});

		it('should set the completed class on a task when the completed checkbox is checked', function() {
			ptor.get('/');

			addTask();

			var completedInput = findElement('#todo-list input[type=checkbox]');
			completedInput.click();

			expect(findElement('#todo-list li').getAttribute('class')).toContain('completed');
		});

		it('should unset the completed class on a task when the completed checkbox is unchecked', function() {
			ptor.get('/');
			addTask();

			var completedInput = findElement('#todo-list input[type=checkbox]');
			completedInput.click();
			completedInput.click();

			expect(findElement('#todo-list li').getAttribute('class')).toNotContain('completed');
		});

		it('should delete a task when the delete button is clicked', function() {
			// Protractor support for hover events in Selenium is still very weak, so we'll skip this test...
		});

		it('should not show the footer if there are no tasks', function() {
			ptor.get('/');

			expect(findElement('#footer').isDisplayed()).toBe(false);
		});

		it('should show the footer if there is a task in the list', function() {
			ptor.get('/');
			addTask();

			expect(findElement('#footer').isDisplayed()).toBe(true);
		});

		it('should show the correct count of items left to be done in the list', function() {
			ptor.get('/');
			addTask();
			addTask();

			expect(findElement('#todo-count').getText()).toBe('2 items left');
		});

		it('should use the singular for items when there is only one item in the list', function() {
			ptor.get('/');
			addTask();

			expect(findElement('#todo-count').getText()).toBe('1 item left');
		});

		it('should not show the clear completed button when there are no completed tasks', function() {
			ptor.get('/');
			addTask();

			expect(findElement('#clear-completed').isDisplayed()).toBe(false);
		});
		it('should show the correct number of completed tasks in the clear completed button', function() {
			ptor.get('/');
			addTask();
			addTask();

			markAllTasksComplete().then(function() {
				addTask();
			}).then(function() {
				expect(findElement('#clear-completed').getText()).toBe('Clear completed (2)');
			});
		});

		it('should delete completed tasks when the clear completed button is clicked', function() {
			ptor.get('/');
			addTask('to delete');
			addTask('to delete 2');

			markAllTasksComplete().then(function() {
				addTask('to keep');
			}).then(function() {
				findElement('#clear-completed').click();
			}).then(function() {
				expect(findElement('#todo-list li:first-child label').getText()).toBe('to keep');
			});
		});

		it('should mark all tasks as completed when the chevrons are clicked', function() {
			ptor.get('/');
			addTask('task1');
			addTask('task2');

			var completeAll = findElement('#toggle-all');
			completeAll.click().then(function() {
				expect(findElement('#todo-count').getText()).toMatch(/^0/);
			});
		});

		function addTask(taskTitle) {
			var taskInput = findElement('#new-todo');

			taskInput.sendKeys(taskTitle || 'default');
			taskInput.submit();
		}

		function findElement(selector) {
			return ptor.findElement(byCss(selector));
		}


		function markAllTasksComplete() {
			return ptor.findElements(byCss('#todo-list li input[type=checkbox]')).then(function (checkboxes) {
				checkboxes.forEach(function (checkbox) {
					checkbox.click();
				});
			});
		}

		function byCss(selector) {
			return protractor.By.css(selector);
		}

	});

})();