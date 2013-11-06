angular.module('tasks').factory('demoDataLoader', function($http, $q) {
	"use strict";

	return {
		loadDemoData : function() {
			var deferred = $q.defer();
			$http.get('/demo.json').success(function(data) {
				deferred.resolve(data);
			}).error(function(data, status) {
				deferred.reject("Failed with code " + status);
			});
			return deferred.promise;
		}
	};
});