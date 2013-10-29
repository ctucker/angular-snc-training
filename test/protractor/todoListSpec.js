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

		function addTask(taskTitle) {
			var taskInput = findElement('#new-todo');

			taskInput.sendKeys(taskTitle || 'default');
			taskInput.submit();
		}

		function findElement(selector) {
			return ptor.findElement(byCss(selector));
		}

		function byCss(selector) {
			return protractor.By.css(selector);
		}

	});

})();