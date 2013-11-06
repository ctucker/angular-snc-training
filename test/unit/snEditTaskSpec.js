/* global describe, it, expect, inject, beforeEach, module, spyOn, jasmine, angular */
'use strict';

describe('sn-edit-task directive', function() {

	var scope, element, $timeout;

	beforeEach(module('tasks'));

	beforeEach(inject(function($rootScope, $compile, _$timeout_) {
		$timeout = _$timeout_;
		scope = $rootScope.$new();

		scope.task = { title : "my task" };
		element = angular.element('<div sn-edit-task="task"><input class="edit"><input></div>');

		$compile(element)(scope);
		scope.$digest();
		scope.editTask = jasmine.createSpy('editTask');
	}));

	it('should call scope.editTask(task) on double click', function() {
		element.triggerHandler('dblclick');
		$timeout.flush(); // flush the timeout
		expect(scope.editTask).toHaveBeenCalled();
	});

	it('should set focus on the edit-class input on double click', function() {
		var editInput = element.find('input')[0];
		spyOn(editInput, 'focus');
		element.triggerHandler('dblclick');
		$timeout.flush();
		expect(editInput.focus).toHaveBeenCalled();
	});


});
