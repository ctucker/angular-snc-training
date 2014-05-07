describe('Todo controller', function() {
	"use strict";

	beforeEach(module('todo'));

	var scope;

	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new();
		$controller('Todo', { $scope : scope });
	}));

	function addATask(title) {
		scope.newTask = title;
		scope.addTask();
		scope.$digest();
		return scope.taskList[scope.taskList.length - 1];
	}

	function titleOfTask(idx) {
		return scope.taskList[idx].title;
	}

	function completionStatusOfTask(idx) {
		return scope.taskList[idx].isComplete;
	}

	function deleteTask(task) {
		scope.deleteTask(task);
		scope.$digest();
	}

	describe('adding a task', function() {
		it('adds the newTask to the list on addTask', function() {
			addATask('My new task');
			expect(titleOfTask(0)).toEqual('My new task');
		});

		it('adds new tasks to the end of the task list', function() {
			addATask('Task 1');
			addATask('Task 2');
			expect(titleOfTask(1)).toEqual('Task 2');
		});

		it('clears the new task input on task addition', function() {
			addATask('Task 1');
			expect(scope.newTask).toEqual('');
		});

		it('strips whitespace from the task input', function() {
			addATask(' Task ');
			expect(titleOfTask(0)).toEqual('Task');
		});

		it('does not allow submission of an empty task', function() {
			addATask('');
			expect(scope.taskList).toEqual([]);
		});

		it('does not allow submission of an all-whitespace task', function() {
			addATask('  ');
			expect(scope.taskList).toEqual([]);
		});

		it('starts a task out in the incomplete state', function() {
			addATask('My task');
			expect(completionStatusOfTask(0)).toEqual(false);
		});
	});

	describe('removing tasks', function() {

		it('deletes a task from the list when deleteTask is invoked', function() {
			var task = addATask('To delete');
			scope.deleteTask(task);
			expect(scope.taskList).toEqual([]);
		});

		it('does nothing when attempting to delete a task that does not exist', function() {
			var newTask = addATask("should remain");
			scope.deleteTask({});
			expect(scope.taskList).toEqual([newTask]);
		});

	});


	describe('tracking whether we have tasks', function() {

		it('starts out not having tasks', function() {
			expect(scope.hasTasks).toBe(false);
		});

		it('indicates it has a task when a task is added', function() {
			addATask('My task');
			expect(scope.hasTasks).toBe(true);
		});

		it('indicates it has no tasks when the last task is deleted', function() {
			var task = addATask('To delete');
			deleteTask(task);
			expect(scope.hasTasks).toBe(false);
		})

	});
});