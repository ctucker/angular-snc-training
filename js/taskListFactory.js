/* global gTasks, angular */
"use strict";

gTasks.factory('taskListFactory', function() {
	return function() {
		var that = {},
			tasks = [];

		function appendTask(taskTitle) {
			var trimmedTitle = trimTitle(taskTitle);
			if (trimmedTitle !== '') {
				tasks.push({ title : trimmedTitle, completed : false });
			}
		}

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

		function trimTitle(title) {
			title = title || '';
			return title.trim();
		}

		// Public API follows
		that.entries = tasks;
		that.appendTask = appendTask;
		that.countIncompleteTasks = countIncompleteTasks;
		that.markAllToCompletionStatus = markAllToCompletionStatus;

		return that;
	};
});