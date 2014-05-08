angular.module('todo').directive('snEditTask', function($timeout) {
	"use strict";

	return {
		restrict: 'A',
		link : function(scope, element, attrs) {
			element.on('dblclick', function() {
				scope.$apply(function() {
					var task = scope[attrs.snEditTask];
					scope.editTask(task);
				});
				focusEditInput();
			});

			function focusEditInput() {
				$timeout(function() {
					element[0].querySelector('input.edit').focus();
				});
			}
		}
	};
});