angular.module('todo').directive('snEditTask', function($timeout) {
	"use strict";

	return {
		restrict : 'A',
		scope : {
			startEditing : '&taskEditor'
		},
		link : function(scope, elem, attrs) {
			elem.on('dblclick', function() {
				scope.$apply(function() {
					var task = scope.$eval(attrs.snEditTask);
					console.log(scope.startEditing);
					scope.startEditing();
					$timeout(function() {
						elem[0].querySelector('input.edit').focus();
					});
				});
			});
		}
	}


});