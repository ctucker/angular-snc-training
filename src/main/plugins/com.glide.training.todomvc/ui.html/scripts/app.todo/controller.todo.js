angular.module('todo').controller('Todo', function($scope) {
	"use strict";

	$scope.taskList = [];
	$scope.taskInput = '';
	$scope.hasTasks = false;

	$scope.addTask = function() {
		var title = $scope.taskInput.trim();
		if (title !== '') {
			$scope.taskList.push(newTask(title));
			$scope.taskInput = '';
		}
	};

	$scope.deleteTask = function(task) {
		var idx = $scope.taskList.indexOf(task);
		if (idx >= 0)
			$scope.taskList.splice(idx, 1);
	};

	$scope.$watch('taskList.length', function(newLength) {
		$scope.hasTasks = !!newLength;
	});

	function newTask(title) {
		return {
			title : title,
			complete: false
		}
	}

});