angular.module('tasks').factory('taskList', function() {
	"use strict";

	function normalizeTitle(title) {
		if (title)
			return title.trim();
		return '';
	}

	return {
		tasks: [],

		hasTasks : false,
		incompleteTaskCount : 0,
		completedTaskCount : 0,

		addTask : function(title) {
			var task;
			var normalizedTitle = normalizeTitle(title);

			if (normalizedTitle !== '') {
				task = {title : normalizedTitle, completed : false};
				this.tasks.push(task);
			}
			return task;
		},

		deleteTask : function(task) {
			var indexOfTask = this.tasks.indexOf(task);
			if (indexOfTask >= 0)
				this.tasks.splice(indexOfTask, 1);
		},

		clearCompleted : function() {
			for (var i = this.tasks.length - 1; i >= 0; i--) {
				if (this.tasks[i].completed)
					this.tasks.splice(i,1);
			}
		},

		markAllToCompletionStatus : function(status) {
			this.tasks.forEach(function(task) {
				task.completed = status;
			});
		},

		recalculateCounts : function() {
			this.hasTasks = this.tasks.length !== 0;
			this.incompleteTaskCount = this.tasks.reduce(function(prev, cur) {
				return prev + (cur.completed ? 0 : 1);
			}, 0);
			this.completedTaskCount = this.tasks.length - this.incompleteTaskCount;
		}
	};
});