(function() {
	"use strict";

	angular.module('tasks').controller('TasksController', function($scope, taskList) {
		$scope.newTask = {};

		$scope.taskList = taskList;

		$scope.hasTasks = false;
		$scope.incompleteTaskCount = 0;
		$scope.completedTaskCount = 0;
		$scope.$watch('taskList.tasks', function(newValue) {
			$scope.hasTasks = newValue.length !== 0;
			$scope.incompleteTaskCount = newValue.filter(function(t) {
				return !t.completed;
			}).length;
			$scope.completedTaskCount = newValue.length - $scope.incompleteTaskCount;
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