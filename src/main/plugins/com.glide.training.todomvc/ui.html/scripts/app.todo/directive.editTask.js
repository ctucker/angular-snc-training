angular.module('todo').directive('snEditTask', function() {
	"use strict";

	return {
		restrict : 'A',
		link : function(scope, elem, attrs) {
			elem.on('dblclick', function() {
				scope.$apply(function() {
					var task = scope.$eval(attrs.snEditTask);
					scope.editTask(task);
					// You need to do your focus stuff here!
					// Remember to yield back to the browser ($timeout) before
					//  attempting to focus so the input can come to the foreground
				});
			});
		}
	}


});