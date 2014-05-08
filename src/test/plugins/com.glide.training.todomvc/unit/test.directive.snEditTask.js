describe('sn-edit-task', function() {
	"use strict";

	beforeEach(module('todo'))

	var scope, element, task;

	beforeEach(inject(function($compile, $rootScope) {
		scope = $rootScope.$new();
		scope.editTask = jasmine.createSpy('editTask');
		task = 'THIS WOULD BE A TASK';
		scope.task = task;
		element = angular.element('<div sn-edit-task="task">');

		$compile(element)(scope);
		scope.$digest();
	}));

	it('calls editTask on a double click event', function() {
		element.triggerHandler('dblclick');
		expect(scope.editTask).toHaveBeenCalledWith(task);
	});

});