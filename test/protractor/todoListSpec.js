(function() {
	'use strict';

	describe('Managing the todo list', function() {

		var ptor;

		beforeEach(function() {
			ptor = protractor.getInstance();
		});

		it('should add a new item to the list', function() {
			ptor.get('/');

			var taskInput = ptor.findElement(protractor.By.css('#new-todo'));
			var item = ptor.findElement(protractor.By.css('#todo-list > li:last-child'));

			// Type something in, and make sure it doesn't immediately reflect
			taskInput.sendKeys("new todo item");
			expect(item.getText()).toNotEqual('new todo item');

			// Submit the input and check that the result is now updated
			taskInput.submit();
			expect(item.getText()).toEqual("new todo item");
		});


	});

})();