angular.module('tasks').factory('taskList', function() {
	"use strict";

	return {
		tasks: [],

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
		}

	};
});