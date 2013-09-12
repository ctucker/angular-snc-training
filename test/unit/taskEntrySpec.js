/* global describe, it, expect, inject, beforeEach, module, spyOn, jasmine, angular */
'use strict';

describe('task entry directive', function() {

	var scope, element;

	beforeEach(module('tasks', 'tpls'));

	beforeEach(inject(function($rootScope, $compile) {
		scope = $rootScope.$new();
		element = angular.element('<task-entry />');
		$compile(element)(scope);
		scope.$digest();
	}));


});
