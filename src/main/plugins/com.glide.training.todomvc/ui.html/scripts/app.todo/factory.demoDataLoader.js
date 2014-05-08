angular.module('todo').factory('demoDataLoader', function($http, taskFactory, demoDataUrl) {
	"use strict";

	return {
		loadData : function() {
			 return $http.get(demoDataUrl).
				then(function(response) {
					return response.data.result.map(function(demoTask) {
						return taskFactory.newTask(demoTask.title, demoTask.iscomplete === 'true')
					})
				});
		}
	};

});