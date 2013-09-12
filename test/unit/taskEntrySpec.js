/* global describe, it, expect, inject, beforeEach, module, spyOn, jasmine, angular */
'use strict';

describe('task entry directive', function() {

	var scope, element;

	beforeEach(module('tasks', 'tpls'));

	beforeEach(inject(function($rootScope, $compile) {
		scope = $rootScope.$new();

		scope.outerTask = { title : 'task title', completed : false };
		scope.editFn = jasmine.createSpy('edit');
		scope.finishEditFn = jasmine.createSpy('finishEdit');
		scope.destroyFn = jasmine.createSpy('destroy');

		element = angular.element(
			'<task-entry ' +
				'task="outerTask" ' +
				'index="1"' +
				'edit="editFn(task)" ' +
				'finish-edit="finishEditFn()" ' +
				'destroy="destroyFn(task)" />'
		);
		$compile(element)(scope);
		scope.$digest();
	}));

	it('includes a view div', function() {
		expect(element.find('div').hasClass('view')).toBeTruthy();
	});

	it('includes an edit form', function() {
		expect(element.find('form').find('input')[0]).toBeDefined();
	});

	describe('isolation', function() {

		it('sets an isolated task instance', function() {
			var isolatedScope = element.find('div').scope();
			expect(isolatedScope.task).toEqual(scope.outerTask);
		});

		it('calls edit function with local task on double click of label', function() {
			var label = element.find('label');
			label.triggerHandler('dblclick');

			expect(scope.editFn).toHaveBeenCalledWith(scope.outerTask);
		});

		it('calls destroy function with local task on destroy button click', function() {
			var destroyButton = element.find('button');
			destroyButton.triggerHandler('click');

			expect(scope.destroyFn).toHaveBeenCalledWith(scope.outerTask);
		});

		describe('finishing editing', function() {

			beforeEach(inject(function($timeout) {
				var label = element.find('label');
				label.triggerHandler('dblclick');
				scope.$apply();
				$timeout.flush();
			}));

			it('calls finish function when blurring edit input field', function() {
				var editInput = element.find('form').find('input');
				editInput.triggerHandler('blur');

				expect(scope.finishEditFn).toHaveBeenCalled();
			});

			it('calls finish function when submitting the edit form', function() {
				var form = element.find('form');
				form.triggerHandler('submit');

				expect(scope.finishEditFn).toHaveBeenCalled();
			});
		});


	});


});