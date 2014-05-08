describe('Todo controller', function() {
	"use strict";

	beforeEach(module('todo'));

	var scope, $location, $httpBackend, demoDataLoader, $q, todoRepository;

	beforeEach(inject(function($rootScope, $controller, _$location_, _$httpBackend_, _$q_, _demoDataLoader_) {
		scope = $rootScope.$new();
		$q = _$q_;
		demoDataLoader = _demoDataLoader_;

		todoRepository = jasmine.createSpyObj('todoRepository', ['addTodo']);

		var deferred = $q.defer();
		deferred.resolve({ title : 'To save', complete : false, sysId : 3 });
		todoRepository.addTodo.andReturn(deferred.promise);

		$controller('Todo', { $scope : scope, todoRepository : todoRepository });

		$location = _$location_;
		$httpBackend = _$httpBackend_;
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

	function completeTask(task) {
		task.isComplete = true;
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

	describe('counting remaining tasks', function() {
		it('starts out with 0 remaining tasks', function() {
			expect(scope.remainingTodos).toBe(0);
		});

		it('increments the remaining tasks when a new task is added', function() {
			addATask('Incomplete task');
			expect(scope.remainingTodos).toBe(1);
		});

		it('decrements the remaining tasks when a task is deleted', function() {
			var task = addATask('To delete');
			deleteTask(task);
			expect(scope.remainingTodos).toBe(0);
		});

		it('decrements the remaining tasks when a task is completed', function() {
			var task = addATask('To complete');
			completeTask(task);
			expect(scope.remainingTodos).toBe(0);
		});
	});

	describe('clearing completed items', function() {
		it('starts out with zero completed items', function() {
			expect(scope.completedTodos).toBe(0);
		});

		it('has a completed todo count of 1 when there is one completed todo', function() {
			var task = addATask('Completed');
			completeTask(task);
			expect(scope.completedTodos).toBe(1);
		});

		it('removes only completed todos when deleteCompleted is called', function() {
			var incomplete = addATask('Incomplete task');
			var complete = addATask('Completed task');
			var incomplete2 = addATask('Another incomplete task');
			completeTask(complete);
			scope.deleteCompleted();
			expect(titleOfTask(0)).toBe('Incomplete task');
			expect(titleOfTask(1)).toBe('Another incomplete task');
		});
	});

	describe('toggling completion of all elements', function() {
		var incomplete1, complete1, incomplete2;
		beforeEach(function() {
			incomplete1 = addATask('First incomplete');
			complete1 = addATask('First complete');
			incomplete2 = addATask('Second incomplete')
			completeTask(complete1);
		});

		it('defaults to allComplete being set to false', function() {
			expect(scope.allComplete).toBe(false);
		});

		it('marks all tasks complete when allComplete is set to true', function() {
			scope.allComplete = true;
			scope.$digest();
			expect(completionStatusOfTask(0)).toBe(true);
			expect(completionStatusOfTask(1)).toBe(true);
			expect(completionStatusOfTask(2)).toBe(true);
		});

		it('marks all tasks incomplete when allComplete is set to false', function() {
			scope.allComplete = true;
			scope.$digest();
			scope.allComplete = false;
			scope.$digest();
			expect(completionStatusOfTask(0)).toBe(false);
			expect(completionStatusOfTask(1)).toBe(false);
			expect(completionStatusOfTask(2)).toBe(false);
		})
	});

	describe('filtering todos', function() {
		it('defaults to an empty status mask', function() {
			expect(scope.statusMask).toEqual({});
		});

		it('sets a mask with isComplete false when location is /active', function() {
			changePath('/active');
			expect(scope.statusMask).toEqual({ isComplete : false });
		});

		it('sets a mask with isComplete true when location is /completed', function() {
			changePath('/completed');
			expect(scope.statusMask).toEqual({ isComplete : true });
		});

		it('sets the mask back to empty when location is re-set to /', function() {
			changePath('/');
			expect(scope.statusMask).toEqual({});
		});

		it('defaults the path to / if path is empty', function() {
			changePath('');
			expect(scope.path).toEqual('/');
		});

		function changePath(newPath) {
			$location.path(newPath);
			scope.$digest();
		}

	});

	describe('loading demo data', function() {

		beforeEach(function() {
			var deferred = $q.defer();
			deferred.resolve([
				{ title : 'My title',
					isComplete : false }
			]);
			spyOn(demoDataLoader, 'loadData').andReturn(deferred.promise);
		});

		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('requests demo data from the demoDataLoader on loadDemoData call', function() {
			scope.loadDemoData();
			expect(demoDataLoader.loadData).toHaveBeenCalled();
		});

		it('adds the tasks from the promise to the task list', function() {
			scope.loadDemoData();
			scope.$digest();
			expect(scope.taskList.length).toEqual(1);
		});

	});

	describe('persisting tasks', function() {
		it('issues an addTodo call to the todoRepository when a new todo is added', function() {
			var task = addATask('To save');
			expect(todoRepository.addTodo).toHaveBeenCalledWith(task);
		});

		it('updates the todo with the sysId of the saved todo', function() {
			var task = addATask('To save');
			expect(task.sysId).toEqual(3);
		});
	});
});