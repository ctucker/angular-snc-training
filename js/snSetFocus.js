/*global gTasks */
'use strict';

/**
 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true
 */
gTasks.directive('snSetFocus', function snSetFocus($timeout) {

	return function (scope, element, attrs) {
		scope.$watch(attrs.snSetFocus, function (newValue) {
			if (newValue) {
				$timeout(function () {
					element[0].focus();
					scope.focusedElement = element[0];
				}, 0, false);
			}
		});
	};
});
