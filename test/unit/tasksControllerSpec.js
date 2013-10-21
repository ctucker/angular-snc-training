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
			addNewTask("New entry title");

			// Verify the behavior: the entries list should now have a first element with the right title
			expect(scope.taskList.tasks[0]).toEqual(taskWithTitle('New entry title'));
		});

		it('adds new entries to the end of the list when there are repeated addEntry() calls', function() {
			addNewTask("task 1");
			addNewTask("task 2");

			expect(scope.taskList.tasks).toEqual([taskWithTitle('task 1'), taskWithTitle('task 2')]);
		});


		function taskWithTitle(taskTitle) {
			return { title: taskTitle };
		}

		function addNewTask(newTitle) {
			scope.newTask = { title: newTitle };
			scope.addTask();
			return scope.newTask;
		}

	});
})();
