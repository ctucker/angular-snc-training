(function( window ) {
	'use strict';

	angular.module('todo', ['ngResource'])
		.value('demoDataUrl', '/api/now/table/todo_sample')
		.value('todoEndpointUrl', '/api/now/table/todo');

})( window );
