angular.module('todo').directive('snEditTask', function() {
	"use strict";

	return {
		restrict : 'A',
		link : function(scope, elem, attrs) {
			elem.on('dblclick', function() {
				scope.$apply(function() {
					var task = scope.$eval(attrs.snEditTask);
					scope.editTask(task)
				});
			});
		}
	}


});