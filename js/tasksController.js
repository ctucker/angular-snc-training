/* global gTasks, angular */
"use strict";

gTasks.controller('TasksController', function($scope, $location, taskListFactory, taskPersister) {

	var paths;
	configureRouting();
	configureCompletionToggle();
	configureTaskListWatch();

	$scope.taskList = taskListFactory(taskPersister.retrieve());
	$scope.newTask = {
		title : ''
	};

	$scope.addTask = function() {
		$scope.taskList.appendTask($scope.newTask.title);
		$scope.newTask.title = '';
	};

	$scope.removeTask = function(task) {
		$scope.taskList.removeTask(task);
	};

	$scope.removeCompletedTasks = function() {
		$scope.taskList.removeAllCompletedTasks();
	};

	$scope.editTask = function(task, index) {
		$scope.taskBeingEdited = task;
		$scope.$broadcast('focusEditInput_' + index);
	};

	$scope.finishEditing = function() {
		$scope.taskBeingEdited = null;
	};

	$scope.currentlyEditing = function() {
		return $scope.taskBeingEdited;
	};


	function configureRouting() {
		paths = {
			'/active' : { completed : false },
			'/completed' : { completed : true },
			'/' : null
		};

		$scope.location = $location;
		$scope.statusFilter = null;

		$scope.$watch('location.path()', function(path) {
			if (paths[path] !== undefined) {
				$scope.statusFilter = paths[path];
			}
			else {
				$scope.location.path("/");
			}
		});
	}

	function configureCompletionToggle() {
		$scope.toggleAllCompleted = false;
		$scope.$watch('toggleAllCompleted', function(completionStatus, oldStatus) {
			if (completionStatus !== oldStatus) {
				$scope.taskList.markAllToCompletionStatus(completionStatus);
			}
		});
	}

	function configureTaskListWatch() {
		$scope.$watch('taskList.tasks', function(tasks) {
			$scope.hasTasks = tasks.length > 0;
			$scope.incompleteTaskCount = $scope.taskList.countIncompleteTasks();
			$scope.completedTaskCount = $scope.taskList.tasks.length - $scope.incompleteTaskCount;
			$scope.hasCompletedTasks = $scope.completedTaskCount > 0;
			taskPersister.store($scope.taskList.tasks);
		}, true);
	}
});