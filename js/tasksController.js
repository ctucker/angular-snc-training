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
			var title = normalizedTitle();
			if (title !== '') {
				$scope.taskList.tasks.push({title : title, completed : false});
				$scope.newTask = {};
			}
		};

		$scope.deleteTask = function(task) {
			var indexOfTask = $scope.taskList.tasks.indexOf(task);
			if (indexOfTask >= 0)
				$scope.taskList.tasks.splice(indexOfTask, 1);
		};

		$scope.clearCompleted = function() {
			$scope.taskList.clearCompleted();
		};

		function normalizedTitle() {
			if ($scope.newTask.title) {
				return $scope.newTask.title.trim();
			}
			return '';
		}
	});
})();