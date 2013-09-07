/* global describe, it, expect, inject, beforeEach, module */
'use strict';

describe('TasksController', function() {

	// Pull in the "tasks" module to get our app configuration
	beforeEach(module('tasks'));

	it('records a new entry in the task list model', inject(function($rootScope, $controller) {
		var scope, tasksCtrl;

		// Create a controller, passing in a newly constructed scope
		scope = $rootScope.$new();
		tasksCtrl = $controller('TasksController', { $scope : scope} );

		// Configure the new entry we're going to add, and add it
		scope.newTask = { title : "New entry title" };
		scope.addEntry();

		// Verify the behavior: the entries list should now have a first element with the right title
		expect(scope.taskList.entries[0]).toEqual({title : 'New entry title' });
	}));

});