describe('todo-list directive', function() {
	"use strict";

	var scope, element, isolateScope;

	beforeEach(module('tasks', 'tpls'));

	beforeEach(inject(function($rootScope, $compile) {
		scope = $rootScope.$new();
		element = angular.element('<todo-list />');
		$compile(element)(scope);
		scope.$digest();
		isolateScope = element.children().scope();
	}));

	it('should include an ng-repeat comment', function() {
		var list = element.find('ul');
		expect(list.attr('id')).toBe('todo-list');
	});

	describe('editing a task', function() {
		var taskList, task;

		beforeEach(inject(function(_taskList_) {
			taskList = _taskList_;
			task = taskList.addTask('title');
		}));

		it('records the currently edited task when editTask is called', function() {
			isolateScope.editTask(task);
			expect(isolateScope.editing.task).toBe(task);
		});

		it('resets the currently edited task when finishEditing is called', function() {
			isolateScope.editTask(task);
			isolateScope.finishEditing();
			expect(isolateScope.editing.task).toBeNull();
		});
	});
});