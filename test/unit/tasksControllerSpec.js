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
	}));

	describe('adding entries', function() {
		it('records a new entry in the task list model when an entry is added', function() {
			// Configure the new entry we're going to add, and add it
			addNewTask('New entry title');

			// Verify the behavior: the entries list should now have a first element with the right title
			expect(getLastEntry()).toEqual(taskWithTitle('New entry title'));
		});

		it('adds new entries to the end of the list when there are repeated addEntry() calls', function() {
			addNewTask("task 1");
			addNewTask("task 2");

			expect(scope.taskList.entries).toEqual([taskWithTitle('task 1'), taskWithTitle('task 2')]);
		});

		it('does not share a reference between the last added entry and the next new entry', function() {
			addNewTask("task 1");
			expect(getLastEntry()).not.toBe(scope.newTask);
		});

		it('resets the newTask to have a blank title after adding an entry', function() {
			addNewTask('task 1');
			expect(scope.newTask.title).toEqual('');
		});
	});

	describe('normalizing entries', function() {
		it('trims whitespace from beginning and end of new entry before adding to list', function() {
			addNewTask('  padded task  ');
			expect(getLastEntry()).toEqual(taskWithTitle('padded task'));
		});

		it('disallows empty entry', function() {
			addNewTask('');
			expect(getLastEntry()).toBe(undefined);
		});

		it('disallows all whitespace entry', function() {
			addNewTask('   ');
			expect(getLastEntry()).toBe(undefined);
		});
	});

	describe('marking entries as complete', function() {
		it('records a default completed status of false for new entries', function() {
			addNewTask('incomplete task');
			expect(getLastEntry().completed).toBe(false);
		});
	});

	describe('removing an entry', function() {
		it('removes the entry under consideration when removeTask is called', function() {
			var addedTask = addNewTask('to be deleted');
			scope.removeTask(addedTask);
			expect(getLastEntry()).toBeUndefined();
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
	});

	function taskWithTitle(taskTitle) {
		return { title: taskTitle, completed : false };
	}

	function addNewTask(newTitle) {
		scope.newTask = { title: newTitle };
		scope.addEntry();
		scope.$apply();
		return getLastEntry();
	}

	function getLastEntry() {
		return scope.taskList.entries[scope.taskList.entries.length - 1];
	}

});