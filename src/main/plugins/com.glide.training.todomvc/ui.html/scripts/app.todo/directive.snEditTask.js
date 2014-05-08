angular.module('todo').directive('snEditTask', function($timeout) {
	"use strict";

	return {
		restrict: 'A',
		link : function(scope, element, attrs) {
			element.on('dblclick', function() {
				$timeout(function() {
					var task = scope[attrs.snEditTask];
					scope.editTask(task);
				});
			})
		}
	};
});