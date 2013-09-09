/* global gTasks */
"use strict";

gTasks.controller('TasksController', function($scope) {

	$scope.taskList = {
		entries : [],

		countIncompleteTasks : function() {
			return this.entries.reduce(function(memo, task) {
				return task.completed ? memo : memo + 1;
			}, 0);
		}
	};

	$scope.hasTasks = false;
	$scope.incompleteTaskCount = 0;
	$scope.$watch('taskList.entries', function(tasks) {
		$scope.hasTasks = tasks.length > 0;
		$scope.incompleteTaskCount = $scope.taskList.countIncompleteTasks();
	}, true) ;

	$scope.newTask = {
		title : ''
	};

	$scope.addEntry = function() {
		var trimmedTitle = trimTitle($scope.newTask.title);
		if (trimmedTitle !== '') {
			$scope.taskList.entries.push({ title : trimmedTitle, completed : false });
			$scope.newTask.title = '';
		}
	};

	$scope.removeTask = function(task) {
		var indexOfTask = $scope.taskList.entries.indexOf(task);
		if (indexOfTask >= 0) {
			$scope.taskList.entries.splice(indexOfTask, 1);
		}
	};

	function trimTitle(title) {
		title = title || '';
		return title.trim();
	}
});