angular.module('todo').controller('Todo', function($scope) {
	"use strict";

	$scope.taskList = [];
	$scope.taskInput = '';

	$scope.addTask = function() {
		$scope.taskList.push($scope.taskInput);
	}
});