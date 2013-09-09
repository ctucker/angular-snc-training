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
		$scope.taskList.entries.push({ title : trimTitle($scope.newTask.title) });
		$scope.newTask.title = '';
	};

	function trimTitle(title) {
		title = title || '';
		return title.trim();
	}

});