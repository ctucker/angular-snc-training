angular.module('todo').controller('Todo', function($scope) {
	"use strict";

	$scope.newTask = '';
	$scope.taskList = [];
	$scope.addTask = function() {
		var title = $scope.newTask.trim();
		if (title) {
			$scope.taskList.push(title);
			$scope.newTask = '';
		}
	}

});