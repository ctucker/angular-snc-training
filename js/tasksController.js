(function() {
	"use strict";

	angular.module('tasks').controller('TasksController', function($scope, $location, taskList, demoDataLoader, persister) {
		var TASK_LIST_KEY = "tasks.list";

		$scope.newTask = {};

		taskList.setTaskList(persister.load(TASK_LIST_KEY));

		$scope.taskList = taskList;
		$scope.location = $location;

		$scope.$watch('taskList.tasks', function() {
			$scope.taskList.recalculateCounts();
			persister.save(TASK_LIST_KEY, $scope.taskList.tasks);
		}, true);

		$scope.toggleAllCompleted = false;
		$scope.$watch('toggleAllCompleted', function(newState, oldState) {
			if (newState !== oldState)
				$scope.taskList.markAllToCompletionStatus(newState);
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