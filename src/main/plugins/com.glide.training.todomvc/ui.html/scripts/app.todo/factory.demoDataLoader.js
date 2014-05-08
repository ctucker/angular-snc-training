angular.module('todo').factory('demoDataLoader', function($http, taskFactory) {
	"use strict";

	return {
		loadData : function() {
			 return $http.get('/api/now/table/todo_sample').
				then(function(response) {
					return response.data.result.map(function(demoTask) {
						return taskFactory.newTask(demoTask.title, demoTask.iscomplete === 'true')
					})
				});
		}
	};

});