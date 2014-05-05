angular.module('todo').controller('Todo', function($scope) {
	"use strict";

	$scope.taskList = [];
	$scope.taskInput = '';

	$scope.addTask = function() {
		var newTask = $scope.taskInput.trim();
		if (newTask !== '') {
			$scope.taskList.push(newTask);
			$scope.taskInput = '';
		}
	}
});