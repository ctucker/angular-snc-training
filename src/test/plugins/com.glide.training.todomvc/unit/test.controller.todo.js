describe('todo controller', function() {
	"use strict";

	beforeEach(module('todo'));

	var scope;

	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		$controller('Todo', { $scope: scope});
	}));


	describe('adding a task', function() {

		function addATask(taskTitle) {
			scope.taskInput = taskTitle;
			scope.addTask();
		}

		it('starts with an empty task list', function() {
			expect(scope.taskList.length).toBe(0);
		});

		it('adds the currently input task when addTask is called', function() {
			addATask('My new task');
			expect(scope.taskList[0]).toEqual('My new task');
		});

		it('adds new tasks to the end of the task list', function() {
			addATask('Task 1');
			addATask('Task 2');
			expect(scope.taskList[1]).toEqual('Task 2');
		});

		it('clears the taskInput after submitting a task', function() {
			addATask('New task');
			expect(scope.taskInput).toBe('');
		});

		it('does not add an empty task', function() {
			addATask('');
			expect(scope.taskList.length).toBe(0);
		});

		it('strips out leading spaces', function() {
			addATask(' My new task');
			expect(scope.taskList[0]).toEqual('My new task');
		});

		it('strips out trailing spaces', function() {
			addATask('My new task ');
			expect(scope.taskList[0]).toEqual('My new task');
		})

	});

});