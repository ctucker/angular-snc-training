angular.module('todo').directive('snEditTask', function($timeout) {
	"use strict";

	return {
		restrict : 'A',
		link : function(scope, elem, attrs) {
			elem.on('dblclick', function() {
				scope.$apply(function() {
					var task = scope.$eval(attrs.snEditTask);
					scope.editTask(task);
					$timeout(function() {
						elem[0].querySelector('input.edit').focus();
					});
				});
			});
		}
	}


});