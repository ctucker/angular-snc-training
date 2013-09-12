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

	it('includes a view div', function() {
		expect(element.find('div').hasClass('view')).toBeTruthy();
	});

	it('includes an edit form', function() {
		expect(element.find('form').find('input')[0]).toBeDefined();
	});

});