describe('todo controller', function() {
	"use strict";

	beforeEach(module('todo'));

	var scope, $httpBackend;

	beforeEach(inject(function($injector) {
		var $rootScope = $injector.get('$rootScope');
		var $controller = $injector.get('$controller');
		$httpBackend = $injector.get('$httpBackend');
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

	describe('counting completed tasks', function() {
		it('starts with 0 completed tasks', function() {
			expect(scope.completedTaskCount).toBe(0);
		});

		it('has a single completed task when a task is marked completed', function() {
			var task = addATask('Completed task');
			completeTask(task);
			expect(scope.completedTaskCount).toBe(1);
		})
	});

	describe('deleting completed tasks', function() {
		it('removes only tasks that are completed', function() {
			var complete1 = addATask('First complete');
			var incomplete = addATask('Incomplete task');
			var complete2 = addATask('Second complete');
			completeTask(complete1);
			completeTask(complete2);
			scope.deleteCompleted();
			expect(scope.taskList.length).toBe(1);
			expect(titleOfTask(0)).toEqual('Incomplete task');
		})
	});

	describe('marking all tasks complete', function() {
		var complete, incomplete;
		beforeEach(function() {
			complete = addATask('Complete');
			incomplete = addATask('Incomplete');
			completeTask(complete);
		});

		it('marks all tasks to complete when toggled', function() {
			scope.toggleAllCompleted = true;
			scope.$digest();
			expect(completionStatusOfTask(0)).toBeTruthy();
			expect(completionStatusOfTask(1)).toBeTruthy();
		});

		it('resets all to incomplete when untoggled', function() {
			scope.toggleAllCompleted = true;
			scope.$digest();
			scope.toggleAllCompleted = false;
			scope.$digest();
			expect(completionStatusOfTask(0)).toBeFalsy();
			expect(completionStatusOfTask(1)).toBeFalsy();
		})
	});

	describe('filtering tasks', function() {
		it('defaults statusMask to empty object', function() {
			expect(scope.statusMask).toEqual({});
		});

		it('sets the statusMask to isComplete : false when location is #/active', function() {
			scope.location.path('#/active');
			scope.$digest();
			expect(scope.statusMask).toEqual( { complete : false } );
		});

		it('sets the statusMask to isComplete : true when location is #/completed', function() {
			scope.location.path('#/completed');
			scope.$digest();
			expect(scope.statusMask).toEqual( { complete : true } );
		});

		it('sets the statusMask to empty object when location is #/', function() {
			scope.location.path('#/');
			scope.$digest();
			expect(scope.statusMask).toEqual( {} );
		});
	});

	describe('fetching demo data', function() {
		var sampleDataEndpoint = 'http://localhost:8080/api/now/table/todo_sample';
		var sampleTodos = [
			{ title: "Todo", isComplete: false }
		];

		beforeEach(function() {
			$httpBackend.whenGET(sampleDataEndpoint).respond({ result : sampleTodos});
		});

		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('requests demo data from the server on loadDemoData call', function() {
			$httpBackend.expectGET();
			scope.loadDemoData();
			$httpBackend.flush();
		});

		it('adds the demo data to the list of tasks', function() {
			scope.loadDemoData();
			$httpBackend.flush();
			expect(titleOfTask(0)).toEqual('Todo');
			expect(completionStatusOfTask(0)).toEqual(false);
		});

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