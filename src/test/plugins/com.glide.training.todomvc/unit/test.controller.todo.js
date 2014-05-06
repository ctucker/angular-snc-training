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
			addATask('My new task');
			expect(titleOfTask(0)).toEqual('My new task');
		});

		it('adds new tasks to the end of the task list', function() {
			addATask('Task 1');
			addATask('Task 2');
			expect(titleOfTask(1)).toEqual('Task 2');
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
			expect(titleOfTask(0)).toEqual('My new task');
		});

		it('strips out trailing spaces', function() {
			addATask('My new task ');
			expect(titleOfTask(0)).toEqual('My new task');
		});

		it('starts out in an incomplete state', function() {
			addATask('My task');
			expect(completionStatusOfTask(0)).toBe(false);
		});

	});

	describe('deleting a task', function() {
		it('removes a task from the list when the task is deleted', function() {
			var newTask = addATask('My task');
			scope.deleteTask(newTask);
			expect(scope.taskList.length).toBe(0);
		});
	});

	function addATask(taskTitle) {
		scope.taskInput = taskTitle;
		scope.addTask();
		return scope.taskList[scope.taskList.length - 1];
	}

	function titleOfTask(idx) {
		return scope.taskList[idx].title;
	}

	function completionStatusOfTask(idx) {
		return scope.taskList[idx].complete;
	}

});