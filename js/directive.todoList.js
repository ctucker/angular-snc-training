angular.module('tasks').directive('todoList', function() {
	"use strict";

	return {
		restrict: 'E',
		templateUrl: 'tpl/todoList.html',
		scope : {
			taskList : '=',
			statusMask : '=',
			deleteTask : '&'
		},
		controller : function($scope) {
			$scope.editing = { task : null };
			$scope.editTask = function(task) {
				$scope.editing.task = task;
			};
			$scope.finishEditing = function() {
				$scope.editing.task = null;
			};
		}
	};

});