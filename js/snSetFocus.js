/*global gTasks */
'use strict';

/**
 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true
 */
gTasks.directive('snSetFocus', function snSetFocus($timeout) {

	return function (scope, element, attrs) {
		scope.$on(attrs.snSetFocus, function() {
			$timeout(function() {
				element[0].focus();
				scope.focusedElement = element;
			}, 0, false);
		});
	};
});
