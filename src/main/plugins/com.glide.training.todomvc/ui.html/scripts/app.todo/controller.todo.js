angular.module('todo').controller('Todo', function($scope, $location, demoDataLoader, taskFactory, todoRepository) {
	"use strict";

	$scope.newTask = '';
	$scope.taskList = [];
	$scope.hasTasks = false;
	$scope.remainingTodos = 0;
	$scope.completedTodos = 0;
	$scope.allComplete = false;
	$scope.statusMask = {};

	$scope.addTask = function() {
		var title = $scope.newTask.trim();
		if (title) {
			var todo = taskFactory.newTask(title);
			$scope.taskList.push(todo);
			todoRepository.addTodo(todo).then(function(serverTask) {
				todo.sysId = serverTask.sysId;
			});
		}
		$scope.newTask = '';
	};

	$scope.deleteTask = function(task) {
		var idx = $scope.taskList.indexOf(task);
		if (idx >= 0)
			$scope.taskList.splice(idx, 1);
	};

	$scope.deleteCompleted = function() {
		for (var i = $scope.taskList.length - 1; i >= 0; i--) {
			if ($scope.taskList[i].isComplete)
				$scope.taskList.splice(i, 1);
		}
	};

	$scope.editTask = function(task) {
		$scope.taskBeingEdited = task;
	};

	$scope.loadDemoData = function() {
		demoDataLoader.loadData().then(function(tasks) {
			tasks.forEach(function(demoTask) {
				$scope.taskList.push(demoTask);
			})
		});
	};

	$scope.$watch('allComplete', function(newStatus) {
		$scope.taskList.forEach(function(task) {
			task.isComplete = newStatus;
		});
	});

	$scope.$watch('taskList', function(newList) {
		$scope.remainingTodos = newList.filter(function(task) {
			return !task.isComplete;
		}).length;
		$scope.completedTodos = newList.length - $scope.remainingTodos;
		$scope.hasTasks = !!$scope.taskList.length;
	}, true);

	$scope.$watch(
		function() { return $location.path() },
		function(newPath) {
			$scope.path = newPath || '/';
			if (/active/.test(newPath))
				$scope.statusMask = { isComplete : false };
			else if (/completed/.test(newPath))
				$scope.statusMask = { isComplete : true };
			else
				$scope.statusMask = {};
	});

});