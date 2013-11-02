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

		describe('setting hasTasks flag', function() {
			it('should set the hasTasks flag to true when the task list has an entry', function() {
				addNewTask('task');
				scope.$apply();

				expect(scope.taskList.hasTasks).toBe(true);
			});

			it('should set the hasTasks flag to false when the last entry is deleted', function() {
				var task = addNewTask('task');
				scope.$apply();
				scope.deleteTask(task);
				scope.$apply();

				expect(scope.taskList.hasTasks).toBe(false);
			});
		});

		describe('counting remaining tasks', function() {
			it('should start out with a count of zero', function() {
				expect(scope.taskList.incompleteTaskCount).toBe(0);
			});

			it('should have a count of 1 when there is one task and it is incomplete', function() {
				addNewTask('task');
				scope.$apply();

				expect(scope.taskList.incompleteTaskCount).toBe(1);
			});

			it('should have a count of 1 when there is one complete and one incomplete task', function() {
				addNewTask('incomplete task');
				addNewTask('complete task', true);
				scope.$apply();

				expect(scope.taskList.incompleteTaskCount).toBe(1);
			});
		});

		describe('completed tasks', function() {
			it('should start out with a count of zero', function() {
				expect(scope.taskList.completedTaskCount).toBe(0);
			});

			it('should have a count of 1 when a single task is completed', function() {
				addNewTask('completed task', true);

				expect(scope.taskList.completedTaskCount).toBe(1);
			});

			it('should have a count of 0 when there are multiple tasks, all incomplete', function() {
				addNewTask('incomplete 1');
				addNewTask('incomplete 2');
				addNewTask('incomplete 3');

				expect(scope.taskList.completedTaskCount).toBe(0);
			});

			it('should have a count of 2 when there are two complete and three incomplete tasks', function() {
				addNewTask('incomplete1');
				addNewTask('complete1', true);
				addNewTask('incomplete2');
				addNewTask('complete2', true);
				addNewTask('incomplete3');

				expect(scope.taskList.completedTaskCount).toBe(2);
			});

			it('should remove all completed tasks when clearCompleted() is called', function() {
				addNewTask('incomplete');
				addNewTask('complete', true);
				addNewTask('complete 2', true);
				addNewTask('incomplete 2');

				scope.clearCompleted();
				scope.$apply();

				expect(scope.taskList.completedTaskCount).toBe(0);
				expect(scope.taskList.tasks.length).toBe(2);
			});
		});

		describe('marking all completed', function() {
			it('when toggleAllCompleted is true, all tasks are marked completed', function() {
				addNewTask('1');
				addNewTask('2');
				addNewTask('3');

				scope.toggleAllCompleted = true;
				scope.$apply();

				expect(scope.taskList.completedTaskCount).toBe(3);
				expect(scope.taskList.incompleteTaskCount).toBe(0);
			});

			it('when toggleAllCompleted is switched to false, all tasks are marked incomplete', function() {
				addNewTask('1');
				addNewTask('2');
				addNewTask('3', true);

				scope.toggleAllCompleted = true;
				scope.$apply();

				scope.toggleAllCompleted = false;
				scope.$apply();

				expect(scope.taskList.completedTaskCount).toBe(0);
				expect(scope.taskList.incompleteTaskCount).toBe(3);
			});
		});

		describe('filtering tasks', function() {

			it('should set an empty status mask for the / path', function() {
				scope.location.path('/');
				scope.$apply();

				expect(scope.statusMask).toEqual({});
			});

			it('should set an empty status mask for the empty path', function() {
				scope.location.path('');
				scope.$apply();

				expect(scope.statusMask).toEqual({});
			});

			it('should set a completed-only status mask for the /completed path', function() {
				scope.location.path('/completed');
				scope.$apply();

				expect(scope.statusMask).toEqual({completed : true});
			});

			it('should set a not-completed status mask for the /active path', function() {
				scope.location.path('/active');
				scope.$apply();

				expect(scope.statusMask).toEqual({completed : false});
			});
		});

		function taskWithTitle(taskTitle) {
			return { title: taskTitle, completed: false};
		}

		function addNewTask(newTitle, isCompleted) {
			scope.newTask = { title: newTitle };
			scope.addTask();
			scope.$apply();
			var addedTask = scope.taskList.tasks[scope.taskList.tasks.length - 1];
			if (isCompleted) {
				addedTask.completed = isCompleted;
				scope.$apply();
			}
			return addedTask;
		}

	});
})();
