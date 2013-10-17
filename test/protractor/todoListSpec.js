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

			taskInput.sendKeys("new todo item");
			expect(item.getText()).toNotEqual('new todo item');

			taskInput.submit();

			expect(item.getText()).toEqual("new todo item");
		});


	});

})();