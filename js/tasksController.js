(function() {
	"use strict";

	angular.module('tasks').controller('TasksController', function($scope) {
		$scope.newTask = {};

		$scope.taskList = {
			tasks: [],

			clearCompleted : function() {
				for (var i = this.tasks.length - 1; i >= 0; i--) {
					if (this.tasks[i].completed)
						this.tasks.splice(i,1);
				}
			}
		};

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