angular.module('todo').controller('Todo', function($scope) {
	"use strict";

	$scope.taskList = [];
	$scope.taskInput = '';

	$scope.addTask = function() {
		var title = $scope.taskInput.trim();
		if (title !== '') {
			$scope.taskList.push(newTask(title));
			$scope.taskInput = '';
		}
	};

	function newTask(title) {
		return {
			title : title,
			complete: false
		}
	}

});