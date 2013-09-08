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
		$scope.taskList.entries.push($scope.newTask);
	};

});