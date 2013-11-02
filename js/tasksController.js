(function() {
	"use strict";

	angular.module('tasks').controller('TasksController', function($scope, $location, taskList, demoDataLoader) {

		$scope.newTask = {};

		$scope.taskList = taskList;
		$scope.location = $location;

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

		$scope.loadDemoData = function() {
			demoDataLoader.loadDemoData().then(function(demoData) {
				$scope.taskList.setTaskList(demoData);
			});
		};
	});
})();