angular.module('todo').factory('todoRepository', function($resource, todoEndpointUrl, taskFactory) {
	"use strict";

	var client = $resource(todoEndpointUrl + '/:sys_id', {sys_id : '@sys_id' }, {
		'post' : { method : 'POST' }
	});

	return {
		addTodo : function(todo) {
			var serverTodo = {
				title : todo.title,
				iscomplete : todo.isComplete
			};

			return client.post(serverTodo).$promise.then(function(response) {
				var taskData = response.result;
				return taskFactory.newTask(taskData.title, taskData.iscomplete === 'true', taskData.sys_id);
			});
		}
	}

});