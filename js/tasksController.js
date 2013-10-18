(function() {
	"use strict";

	angular.module('tasks').controller('TasksController', function($scope) {
		$scope.newTask = {};

		$scope.taskList = {
			tasks: []
		};

		$scope.addTask = function() {
			$scope.taskList.tasks.push({title : $scope.newTask.title });
		};
	});
})();