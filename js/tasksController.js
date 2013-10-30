(function() {
	"use strict";

	angular.module('tasks').controller('TasksController', function($scope, taskList) {
		$scope.newTask = {};

		$scope.taskList = taskList;

		$scope.$watch('taskList.tasks', function() {
			$scope.taskList.recalculateCounts();
		}, true);

		$scope.toggleAllCompleted = false;
		$scope.$watch('toggleAllCompleted', function(toggleState) {
			$scope.taskList.markAllToCompletionStatus(toggleState);
		});

		$scope.addTask = function() {
			$scope.taskList.addTask($scope.newTask.title);
			$scope.newTask = {};
		};

		$scope.deleteTask = function(task) {
			$scope.taskList.deleteTask(task);
		};

		$scope.clearCompleted = function() {
			$scope.taskList.clearCompleted();
		};
	});
})();