angular.module('tasks').directive('todoList', function() {
	"use strict";

	return {
		restrict: 'E',
		templateUrl: 'tpl/todoList.html',
		scope : {
			taskList : '=',
			statusMask : '=',
			deleteTask : '&'
		}
	};

});