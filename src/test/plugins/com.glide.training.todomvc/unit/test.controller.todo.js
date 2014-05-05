describe('todo controller', function() {
	"use strict";

	beforeEach(module('todo'));

	var scope;

	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		$controller('Todo', { $scope: scope});
	}));


	describe('adding a task', function() {

		it('starts with an empty task list', function() {
			expect(scope.taskList.length).toBe(0);
		});

		it('adds the currently input task when addTask is called', function() {
			scope.taskInput = 'My new task';
			scope.addTask();
			expect(scope.taskList[0]).toEqual('My new task');
		});

		it('adds new tasks to the end of the task list', function() {
			scope.taskInput = 'Task 1';
			scope.addTask();
			scope.taskInput = 'Task 2';
			scope.addTask();
			expect(scope.taskList[1]).toEqual('Task 2');
		})

	});

});