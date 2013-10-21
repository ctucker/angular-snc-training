(function() {
	'use strict';

	describe('Managing the todo list', function() {

		var ptor;

		beforeEach(function() {
			ptor = protractor.getInstance();
		});

		function getItems() {
			return ptor.findElements(protractor.By.css('#todo-list > li'));
		}

		it('should add a new item to the list', function() {
			ptor.get('/');

			var taskInput = ptor.findElement(protractor.By.css('#new-todo'));

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

			var taskInput = ptor.findElement(protractor.By.css('#new-todo'));

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

	});

})();