/* global gTasks, angular */
"use strict";

gTasks.controller('TasksController', function($scope, taskListFactory) {

	$scope.taskList = taskListFactory();

	$scope.newTask = {
		title : ''
	};

	$scope.statusFilter = null;

	$scope.toggleAllCompleted = false;
	$scope.$watch('toggleAllCompleted', function(completionStatus, oldStatus) {
		if (completionStatus !== oldStatus) {
			$scope.taskList.markAllToCompletionStatus(completionStatus);
		}
	});

	$scope.$watch('taskList.tasks', function(tasks) {
		$scope.hasTasks = tasks.length > 0;
		$scope.incompleteTaskCount = $scope.taskList.countIncompleteTasks();
		$scope.completedTaskCount = $scope.taskList.tasks.length - $scope.incompleteTaskCount;
		$scope.hasCompletedTasks = $scope.completedTaskCount > 0;
	}, true);

	$scope.addTask = function() {
		$scope.taskList.appendTask($scope.newTask.title);
		$scope.newTask.title = '';
	};

	$scope.removeTask = function(task) {
		$scope.taskList.removeTask(task);
	};

	$scope.removeCompletedTasks = function() {
		$scope.taskList.removeAllCompletedTasks();
	};

});