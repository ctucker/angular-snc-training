angular.module('todo').controller('Todo', function($scope) {
	"use strict";

	$scope.newTask = '';
	$scope.taskList = [];
	$scope.hasTasks = false;

	$scope.addTask = function() {
		var title = $scope.newTask.trim();
		if (title)
			$scope.taskList.push(newTask(title));
		$scope.newTask = '';
	};

	$scope.deleteTask = function(task) {
		var idx = $scope.taskList.indexOf(task);
		if (idx >= 0)
			$scope.taskList.splice(idx, 1);
	};

	$scope.$watch('taskList.length', function(newLength) {
		$scope.hasTasks = !!$scope.taskList.length;
	});

	function newTask(title) {
		return {
			title : title,
			isComplete : false
		}
	}

});