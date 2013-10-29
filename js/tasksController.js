(function() {
	"use strict";

	angular.module('tasks').controller('TasksController', function($scope) {
		$scope.newTask = {};

		$scope.taskList = {
			tasks: []
		};

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

		function normalizedTitle() {
			if ($scope.newTask.title) {
				return $scope.newTask.title.trim();
			}
			return '';
		}
	});
})();