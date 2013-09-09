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

	it('trims whitespace from beginning and end of new entry before adding to list', function() {
		addNewTask('  padded task  ');
		expect(getLastEntry()).toEqual(taskWithTitle('padded task'));
	});

	function taskWithTitle(taskTitle) {
		return { title: taskTitle };
	}

	function addNewTask(newTitle) {
		scope.newTask = { title: newTitle };
		scope.addEntry();
	}

	function getLastEntry() {
		return scope.taskList.entries[scope.taskList.entries.length - 1];
	}

});