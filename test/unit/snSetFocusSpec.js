/* global describe, it, expect, inject, beforeEach, module, spyOn, jasmine, angular */
'use strict';

describe('snSetFocus directive', function() {

	var scope, element, timeout;

	beforeEach(module('tasks'));

	beforeEach(inject(function($rootScope, $compile, $timeout) {
		timeout = $timeout;
		scope = $rootScope.$new();

		element = angular.element('<input sn-set-focus="inFocus" />');

		$compile(element)(scope);
		scope.$digest();
	}));


});
