angular.module('todo').factory('todoRepository', function($resource, todoEndpointUrl) {
	"use strict";

	var client = $resource(todoEndpointUrl + '/:sys_id', {sys_id : '@sys_id' }, {
		'post' : { method : 'POST' }
	});

	return {
		addTodo : function(todo) {
			throw "You need to implement me!";
		}
	}

});