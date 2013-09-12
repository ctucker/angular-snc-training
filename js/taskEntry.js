/*global gTasks */
'use strict';

gTasks.directive('taskEntry', function() {

	return {
		restrict: 'E',
		scope : {
			task : '=',
			index : '=',
			edit : '&',
			destroy : '&',
			finishEdit : '&'
		},
		templateUrl : 'tpl/taskEntry.html'
	};

});