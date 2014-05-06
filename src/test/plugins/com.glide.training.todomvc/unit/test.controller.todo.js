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
	}

	describe('adding a task', function() {
		it('adds the newTask to the list on addTask', function() {
			addATask('My new task');
			expect(scope.taskList[0]).toEqual('My new task');
		});

		it('adds new tasks to the end of the task list', function() {
			addATask('Task 1');
			addATask('Task 2');
			expect(scope.taskList).toEqual(['Task 1', 'Task 2']);
		});
	});
});