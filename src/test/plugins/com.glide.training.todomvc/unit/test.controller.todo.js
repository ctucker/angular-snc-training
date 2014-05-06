describe('Todo controller', function() {
	"use strict";

	beforeEach(module('todo'));

	describe('adding a task', function() {
		it('adds the newTask to the list on addTask', inject(function($rootScope, $controller) {
			var scope = $rootScope.$new();
			$controller('Todo', { $scope : scope });

			scope.newTask = 'My new task';
			scope.addTask();

			expect(scope.taskList[0]).toEqual('My new task');
		}));
	});
});