/* global describe, it, expect, inject, beforeEach, module, spyOn, jasmine, angular */
'use strict';

describe('sn-edit-task directive', function() {

	var scope, element, $timeout;

	beforeEach(module('tasks'));

	beforeEach(inject(function($rootScope, $compile, _$timeout_) {
		$timeout = _$timeout_;
		scope = $rootScope.$new();

		scope.task = { title : "my task" };
		element = angular.element('<input sn-edit-task="task" />');

		$compile(element)(scope);
		scope.$digest();
		scope.editTask = jasmine.createSpy('editTask');
	}));

	it('should call scope.editTask(task) on double click', function() {
		element.triggerHandler('dblclick');
		$timeout.flush(); // flush the timeout
		expect(scope.editTask).toHaveBeenCalled();
	});


});
