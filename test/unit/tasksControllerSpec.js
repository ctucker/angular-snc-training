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

		describe('adding a task', function() {
			it('records a new entry in the task list model', function() {
				// Configure the new entry we're going to add, and add it
				addNewTask("New entry title");

				// Verify the behavior: the entries list should now have a first element with the right title
				expect(scope.taskList.tasks[0]).toEqual(taskWithTitle('New entry title'));
			});

			it('adds new entries to the end of the list when there are repeated addTask() calls', function() {
				addNewTask("task 1");
				addNewTask("task 2");

				expect(scope.taskList.tasks).toEqual([taskWithTitle('task 1'), taskWithTitle('task 2')]);
			});

			it('clears the take title after submitting the form', function() {
				addNewTask("task 1");
				expect(scope.newTask.title).not.toBeDefined();
			});

			it('prevents the addition of an empty task title', function() {
				addNewTask('');
				expect(scope.taskList.tasks.length).toBe(0);
			});

			it('prevents the addition of a task when no title is set', function() {
				scope.addTask();
				expect(scope.taskList.tasks.length).toBe(0);
			});

			describe('whitespace handling', function() {

				it('strips leading whitespace from a task title before adding', function() {
					addNewTask("   task");
					expect(scope.taskList.tasks).toEqual([taskWithTitle('task')]);
				});

				it('strips trailing whitespace from a task title before adding', function() {
					addNewTask("task   ");
					expect(scope.taskList.tasks).toEqual([taskWithTitle('task')]);
				});

			});
		});

		describe('completing a task', function() {
			it('starts out with a new task being incomplete', function() {
				var task = addNewTask('task');
				expect(task.completed).toBe(false);
			});
		});

		describe('deleting a task', function() {
			it('should remove a task from the task list if the delete function is called', function() {
				var task = addNewTask('task');
				scope.deleteTask(task);
				expect(scope.taskList.tasks.length).toBe(0);
			});

			it('should no-op if asked to remove a task that does not exist', function() {
				var task = addNewTask('task');
				scope.deleteTask({ title : 'foo' });
				expect(scope.taskList.tasks.length).toBe(1);
			});
		});

		function taskWithTitle(taskTitle) {
			return { title: taskTitle, completed: false};
		}

		function addNewTask(newTitle) {
			scope.newTask = { title: newTitle };
			scope.addTask();
			return scope.taskList.tasks[scope.taskList.tasks.length - 1];
		}

	});
})();
