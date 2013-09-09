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

		function removeTask(task) {
			var indexOfTask = tasks.indexOf(task);
			if (indexOfTask >= 0) {
				tasks.splice(indexOfTask, 1);
			}
		}

		function removeAllCompletedTasks() {
			var i = 0;
			while(i < tasks.length) {
				if (tasks[i].completed) {
					tasks.splice(i, 1);
				}
				else {
					++i;
				}
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
		that.tasks = tasks;
		that.appendTask = appendTask;
		that.removeTask = removeTask;
		that.removeAllCompletedTasks = removeAllCompletedTasks;
		that.countIncompleteTasks = countIncompleteTasks;
		that.markAllToCompletionStatus = markAllToCompletionStatus;

		return that;
	};
});