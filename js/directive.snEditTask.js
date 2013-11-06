angular.module('tasks').directive('snEditTask', function($timeout) {
	"use strict";

	function findEditInput(childInputs) {
		for (var i = 0; i < childInputs.length; ++i) {
			var classNames = childInputs[i].getAttribute('class');
			if (classNames && classNames.indexOf('edit') >= 0)
				return childInputs[i];
		}
		return void(0);
	}

	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			var editInput = findEditInput(element.find('input'));

			element.on('dblclick', function() {
				$timeout(function() {
					var task = scope[attrs.snEditTask];
					scope.editTask(task);
					scope.$digest();
					editInput.focus();
				});
			});
		}
	};

});