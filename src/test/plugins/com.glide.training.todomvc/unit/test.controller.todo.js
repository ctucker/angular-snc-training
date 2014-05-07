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

	describe('tracking tasks', function() {
		it('starts with hasTask flag to false when there are no tasks', function() {
			expect(scope.hasTasks).toBe(false);
		});

		it('sets hasTask flag to true when a task is added', function() {
			addATask('New task');
			scope.$apply();
			expect(scope.hasTasks).toBe(true);
		});

		it('sets hasTask flag back to false when the last task is removed', function() {
			var task = addATask('New task');
			scope.deleteTask(task);
			scope.$apply();
			expect(scope.hasTasks).toBe(false);
		});

		it('does not reset hasTask flag one one but not all tasks are removed', function() {
			var task = addATask('New task');
			addATask('Another task');
			scope.deleteTask(task);
			scope.$apply();
			expect(scope.hasTasks).toBe(true);
		})
	});

	describe('counting incomplete tasks', function() {
		it('starts with 0 incomplete tasks', function() {
			expect(scope.incompleteTaskCount).toBe(0);
		});

		it('has a single incomplete task when a new task is added', function() {
			addATask('Incomplete task');
			expect(scope.incompleteTaskCount).toBe(1);
		});

		it('has a single incomplete task when two tasks are added and one is completed', function() {
			addATask('Incomplete task');
			var complete = addATask('Completed task');
			completeTask(complete);
			expect(scope.incompleteTaskCount).toBe(1);
		});

		it('has no incomplete tasks when all tasks are completed', function() {
			var task1 = addATask('Task 1');
			var task2 = addATask('Task 2');
			completeTask(task1);
			completeTask(task2);
			expect(scope.incompleteTaskCount).toBe(0);
		})
	});

	function addATask(taskTitle) {
		scope.taskInput = taskTitle;
		scope.addTask();
		scope.$apply();
		return scope.taskList[scope.taskList.length - 1];
	}

	function completeTask(task) {
		task.complete = true;
		scope.$apply();
	}

	function titleOfTask(idx) {
		return scope.taskList[idx].title;
	}

	function completionStatusOfTask(idx) {
		return scope.taskList[idx].complete;
	}

});