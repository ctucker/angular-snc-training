describe('todo-list directive', function() {
	"use strict";

	var scope, element;

	beforeEach(module('tasks', 'tpls'));

	beforeEach(inject(function($rootScope, $compile) {
		scope = $rootScope.$new();
		element = angular.element('<todo-list />');
		$compile(element)(scope);
		scope.$digest();
	}));

	it('should include an ng-repeat comment', function() {
		var list = element.find('ul');
		expect(list.attr('id')).toBe('todo-list');
	});
});