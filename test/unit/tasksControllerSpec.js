/* global describe, it, expect, inject, beforeEach, module */
'use strict';

describe('TasksController', function() {
	var scope, tasksCtrl;

	// Pull in the "tasks" module to get our app configuration
	beforeEach(module('tasks'));

	beforeEach(inject(function($rootScope, $controller) {
		// Create a controller, passing in a newly constructed scope
		scope = $rootScope.$new();
		tasksCtrl = $controller('TasksController', { $scope : scope} );
		scope.$apply();
	}));

	beforeEach(function() {
		this.addMatchers( {
			toBeCompleted : function() {
				var actual = this.actual;
				this.message = function() {
					return "Expected " + JSON.stringify(actual) + " to" + (this.isNot ? " not " : " ") + "be completed";
				};

				return this.actual && this.actual.completed === true;
			}
		});
	});

	describe('adding tasks', function() {
		it('records a new task in the task list model when an task is added', function() {
			// Configure the new task we're going to add, and add it
			addNewTask('New task title');

			// Verify the behavior: the tasks list should now have a first element with the right title
			expect(getLastTask()).toEqual(taskWithTitle('New task title'));
		});

		it('adds new tasks to the end of the list when there are repeated addTask() calls', function() {
			addNewTask("task 1");
			addNewTask("task 2");

			expect(scope.taskList.tasks).toEqual([taskWithTitle('task 1'), taskWithTitle('task 2')]);
		});

		it('does not share a reference between the last added task and the next new task', function() {
			addNewTask("task 1");
			expect(getLastTask()).not.toBe(scope.newTask);
		});

		it('resets the newTask to have a blank title after adding an task', function() {
			addNewTask('task 1');
			expect(scope.newTask.title).toEqual('');
		});
	});

	describe('normalizing tasks', function() {
		it('trims whitespace from beginning and end of new task before adding to list', function() {
			addNewTask('  padded task  ');
			expect(getLastTask()).toEqual(taskWithTitle('padded task'));
		});

		it('disallows empty task', function() {
			addNewTask('');
			expect(getLastTask()).toBe(undefined);
		});

		it('disallows all whitespace task', function() {
			addNewTask('   ');
			expect(getLastTask()).toBe(undefined);
		});
	});

	describe('marking tasks as complete', function() {
		it('records a default completed status of false for new tasks', function() {
			addNewTask('incomplete task');
			expect(getLastTask().completed).toBe(false);
		});

		describe('toggling all', function() {

			it('marks all tasks as completed when toggleAllCompleted value is toggled on', function() {
				var task1 = addNewTask('task 1'),
					task2 = addNewTask('task 2');

				scope.toggleAllCompleted = true;
				scope.$apply();

				expect(task1).toBeCompleted();
				expect(task2).toBeCompleted();
			});

			it('marks all tasks as incomplete when toggleAllCompleted value is toggled off', function() {
				var task1, task2;

				// We have to do this to flip the state so the toggle can "take"
				scope.toggleAllCompleted = true;
				scope.$apply();

				task1 = addNewTask('task 1', true);
				task2 = addNewTask('task 2', true);

				scope.toggleAllCompleted = false;
				scope.$apply();

				expect(task1).not.toBeCompleted();
				expect(task2).not.toBeCompleted();
			});

		});

	});

	describe('removing tasks', function() {
		it('removes the task under consideration when removeTask is called', function() {
			var addedTask = addNewTask('to be deleted');
			scope.removeTask(addedTask);
			expect(getLastTask()).toBeUndefined();
		});

		it('removes all tasks marked completed when removeCompletedTasks is called', function() {
			var incompleteTask;
			addNewTask('first completed', true);
			addNewTask('second completed', true);
			incompleteTask = addNewTask('first incomplete', false);
			addNewTask('third completed', true);

			scope.removeCompletedTasks();

			expect(getLastTask()).toBe(incompleteTask);
			expect(scope.taskList.tasks.length).toBe(1);
		});
	});

	describe('recognizing when the list has tasks', function() {
		it('sets hasTasks to false when the list is initially empty', function() {
			expect(scope.hasTasks).toBe(false);
		});

		it('sets hasTasks to be true when a task is added', function() {
			addNewTask('task 1');
			expect(scope.hasTasks).toBe(true);
		});

		it('counts 0 incomplete tasks when there are no tasks', function() {
			expect(scope.incompleteTaskCount).toEqual(0);
		});

		it('counts 1 incomplete task when there is one task and it is incomplete', function() {
			addNewTask('incomplete task');
			expect(scope.incompleteTaskCount).toEqual(1);
		});

		it('counts 1 incomplete task when there is one incomplete task and several completed tasks', function() {
			var complete1, complete2, incomplete;
			complete1 = addNewTask('completed task 1');
			incomplete = addNewTask('incomplete task');
			complete2 = addNewTask('complete task 2');

			complete1.completed = true;
			complete2.completed = true;
			scope.$apply(); // To catch the model change

			expect(scope.incompleteTaskCount).toEqual(1);
		});

		it('counts 0 complete tasks where there are no tasks', function() {
			expect(scope.completedTaskCount).toEqual(0);
		});

		it('counts 1 completed task when there is one task and it is completed', function() {
			var completed = addNewTask('completed');
			completed.completed = true;
			scope.$apply();

			expect(scope.completedTaskCount).toEqual(1);
		});

		it('counts 2 completed tasks when there are two completed and one incomplete tasks', function() {
			var complete1, complete2, incomplete;
			complete1 = addNewTask('completed task 1');
			incomplete = addNewTask('incomplete task');
			complete2 = addNewTask('complete task 2');

			complete1.completed = true;
			complete2.completed = true;
			scope.$apply();

			expect(scope.completedTaskCount).toEqual(2);
		});
	});

	describe('filtering by location', function() {
		var filterFilter, incomplete1, complete1, incomplete2, complete2;

		beforeEach(inject(function(_filterFilter_) {
			incomplete1 = addNewTask('incomplete1', false);
			complete1 = addNewTask('complete1', true);
			incomplete2 = addNewTask('incomplete2', false);
			complete2 = addNewTask('complete2', true);
			filterFilter = _filterFilter_;
		}));

		it('sets an empty filter by default', function() {
			expect(filterFilter(scope.taskList.tasks, scope.statusFilter))
				.toEqual([incomplete1, complete1, incomplete2, complete2]);
		});
	});

	function taskWithTitle(taskTitle) {
		return { title: taskTitle, completed : false };
	}

	function addNewTask(newTitle, completed) {
		var addedTask;
		scope.newTask = { title: newTitle };
		scope.addTask();
		addedTask = getLastTask();
		if (addedTask) {
			addedTask.completed = completed ? true : false;
		}
		scope.$apply();

		return addedTask;
	}

	function getLastTask() {
		return scope.taskList.tasks[scope.taskList.tasks.length - 1];
	}

});