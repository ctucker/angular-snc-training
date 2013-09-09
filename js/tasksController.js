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
			$scope.taskList.entries.push({ title : trimmedTitle });
			$scope.newTask.title = '';
		}
	};

	function trimTitle(title) {
		title = title || '';
		return title.trim();
	}

});