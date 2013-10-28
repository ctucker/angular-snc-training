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

		function normalizedTitle() {
			if ($scope.newTask.title) {
				return $scope.newTask.title.trim();
			}
			return '';
		}
	});
})();