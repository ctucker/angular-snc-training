describe('sn-edit-task', function() {
	"use strict";

	beforeEach(module('todo'));

	var TASK_OBJECT = 'SOME_TASK';

	var element, scope, $timeout;

	beforeEach(inject(function($compile, $rootScope, $injector) {
		$timeout = $injector.get('$timeout');

		element = angular.element(
			'<div sn-edit-task="task">' +
				'<input class="not-edit">' +
				'<input class="edit">' +
			'</div>'
		);
		scope = $rootScope.$new();
		scope.task = TASK_OBJECT;
		scope.editTask = jasmine.createSpy('editTask');

		$compile(element)(scope);
		scope.$digest();
	}));

	it('calls scope.editTask on double click event', function() {
		element.triggerHandler('dblclick');
		$timeout.flush();
		expect(scope.editTask).toHaveBeenCalledWith(TASK_OBJECT);
	});

	it('sets focus on the edit input on double click event', function() {
		var editInput = element[0].querySelector('input.edit');
		spyOn(editInput, 'focus');
		element.triggerHandler('dblclick');
		$timeout.flush();

		expect(editInput.focus).toHaveBeenCalled();
	})

});