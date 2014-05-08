angular.module('todo').factory('demoDataLoader', function($http) {
	"use strict";

	return {

		loadData : function() {
			 return $http.get('/api/now/table/todo_sample').
				then(function(response) {
					return response.data.result.map(function(demoTask) {
						return {
							title : demoTask.title,
							isComplete : demoTask.iscomplete === 'true'
						}
					})
				});

		}

	};

});