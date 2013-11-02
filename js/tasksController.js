(function() {
	"use strict";

	angular.module('tasks').controller('TasksController', function($scope, $location, taskList) {

		$scope.newTask = {};

		$scope.taskList = taskList;
		$scope.location = $location;

		$scope.$watch('taskList.tasks', function() {
			$scope.taskList.recalculateCounts();
		}, true);

		$scope.toggleAllCompleted = false;
		$scope.$watch('toggleAllCompleted', function(toggleState) {
			$scope.taskList.markAllToCompletionStatus(toggleState);
		});

		$scope.$watch('location.path()', function(newPath) {
			if (newPath === '/active') {
				$scope.statusMask = { completed : false };
				$scope.selectedFilter = 'active';
			}
			else if (newPath === '/completed') {
				$scope.statusMask = { completed : true };
				$scope.selectedFilter = 'completed';
			}
			else {
				$scope.statusMask = {};
				$scope.selectedFilter = 'all';
			}
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