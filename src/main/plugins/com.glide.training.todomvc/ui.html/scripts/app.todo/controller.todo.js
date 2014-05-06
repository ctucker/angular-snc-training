angular.module('todo').controller('Todo', function($scope) {
	"use strict";

	$scope.newTask = '';
	$scope.taskList = [];
	$scope.addTask = function() {
		$scope.taskList.push($scope.newTask);
	}

});