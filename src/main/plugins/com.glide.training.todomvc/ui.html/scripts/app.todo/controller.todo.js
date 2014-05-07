angular.module('todo').controller('Todo', function($scope) {
	"use strict";

	$scope.newTask = '';
	$scope.taskList = [];
	$scope.hasTasks = false;
	$scope.remainingTodos = 0;

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

	$scope.$watch('taskList', function(newList) {
		$scope.remainingTodos = newList.filter(function(task) {
			return !task.isComplete;
		}).length;
		$scope.hasTasks = !!$scope.taskList.length;
	}, true);

	function newTask(title) {
		return {
			title : title,
			isComplete : false
		}
	}

});