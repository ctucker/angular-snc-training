/* global gTasks, angular */
"use strict";

gTasks.controller('TasksController', function($scope) {

	$scope.taskList = {
		entries : [],

		countIncompleteTasks : function() {
			return this.entries.reduce(function(memo, task) {
				return task.completed ? memo : memo + 1;
			}, 0);
		},

		markAllToCompletionStatus : function(completionStatus) {
			angular.forEach(this.entries, function(task) {
				task.completed = completionStatus;
			});
		}
	};

	$scope.toggleAllCompleted = false;
	$scope.$watch('toggleAllCompleted', function(completionStatus, oldStatus) {
		if (completionStatus !== oldStatus) {
			$scope.taskList.markAllToCompletionStatus(completionStatus);
		}
	});

	$scope.hasTasks = false;
	$scope.incompleteTaskCount = 0;
	$scope.completedTaskCount = 0;
	$scope.hasCompletedTasks = $scope.completedTaskCount > 0;

	$scope.$watch('taskList.entries', function(tasks) {
		$scope.hasTasks = tasks.length > 0;
		$scope.incompleteTaskCount = $scope.taskList.countIncompleteTasks();
		$scope.completedTaskCount = $scope.taskList.entries.length - $scope.incompleteTaskCount;
		$scope.hasCompletedTasks = $scope.completedTaskCount > 0;
	}, true);

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

	$scope.removeCompletedTasks = function() {
		var tasks = $scope.taskList.entries;
		var i = 0;
		while(i < tasks.length) {
			if (tasks[i].completed) {
				tasks.splice(i, 1);
			}
			else {
				++i;
			}
		}
	};

	function trimTitle(title) {
		title = title || '';
		return title.trim();
	}
});