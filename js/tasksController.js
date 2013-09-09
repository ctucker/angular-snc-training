/* global gTasks */
"use strict";

gTasks.controller('TasksController', function($scope) {

	$scope.taskList = {
		entries : []
	};

	$scope.newTask = {
		title : ''
	};

	$scope.addEntry = function() {
		var trimmedTitle = trimTitle($scope.newTask.title);
		if (trimmedTitle !== '') {
			$scope.taskList.entries.push({ title : trimmedTitle, completed : false });
			$scope.newTask.title = '';
		}
	};

	$scope.removeTask = function(task) {
		var indexOfTask = $scope.taskList.entries.indexOf(task);
		if (indexOfTask >= 0) {
			$scope.taskList.entries.splice(indexOfTask, 1);
		}
	};

	function trimTitle(title) {
		title = title || '';
		return title.trim();
	}

});