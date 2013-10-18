(function() {
	'use strict';

	describe('TasksController', function() {

		var scope;

		// Pull in the "tasks" module to get our app configuration
		beforeEach(module('tasks'));

		beforeEach(inject(function($rootScope, $controller) {
			// Create a controller, passing in a newly constructed scope
			scope = $rootScope.$new();
			$controller('TasksController', { $scope : scope} );
		}));

		it('records a new entry in the task list model', function() {
			// Configure the new entry we're going to add, and add it
			scope.newTask = { title : "New entry title" };
			scope.addTask();

			// Verify the behavior: the entries list should now have a first element with the right title
			expect(scope.taskList.tasks[0]).toEqual({title : 'New entry title' });
		});

	});
})();