/* global describe, it, expect, inject, beforeEach, module, spyOn, jasmine, angular */
'use strict';

describe('snSetFocus directive', function() {

	var scope, element, timeout;

	beforeEach(module('tasks'));

	beforeEach(inject(function($rootScope, $compile, $timeout) {
		timeout = $timeout;
		scope = $rootScope.$new();
		scope.inFocus = false;

		element = angular.element('<input sn-set-focus="inFocus" />');

		$compile(element)(scope);
		scope.$digest();
	}));

	it('sets the input to be focussed when inFocus is toggled to true', function() {
		scope.inFocus = true;

		scope.$apply();
		timeout.flush(); // Flush the timeout queue so we don't have a timing issue

		expect(scope.focusedElement).toBe(element[0]);
	});

});