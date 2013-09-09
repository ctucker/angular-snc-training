/* global gTasks, angular */
"use strict";

gTasks.factory('taskListFactory', function() {
	return function() {
		var that = {},
			tasks = [];

		function countIncompleteTasks() {
			return tasks.reduce(function(memo, task) {
				return task.completed ? memo : memo + 1;
			}, 0);
		}

		function markAllToCompletionStatus(completionStatus) {
			angular.forEach(tasks, function(task) {
				task.completed = completionStatus;
			});
		}

		that.entries = tasks;
		that.countIncompleteTasks = countIncompleteTasks;
		that.markAllToCompletionStatus = markAllToCompletionStatus;

		return that;
	};
});