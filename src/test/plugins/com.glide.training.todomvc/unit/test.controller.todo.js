describe('todo controller', function() {
	"use strict";

	beforeEach(module('todo'));

	describe('adding a task', function() {

		it('starts with an empty task list', inject(function($rootScope, $controller) {
			var scope = $rootScope.$new();
			$controller('Todo', { $scope : scope} );
			expect(scope.taskList.length).toBe(0);
		}));

	});

});