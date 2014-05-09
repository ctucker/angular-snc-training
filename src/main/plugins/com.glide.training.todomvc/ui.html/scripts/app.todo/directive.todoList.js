angular.module('todo').directive('snTodoList', function() {
	"use strict";

	return {
		restrict: 'E',
		replace : true,
		scope : {
			tasks : '=listOfTasks',
			mask : '=',
			editing : '=taskBeingEdited',
			editTask : '&',
			removeTask : '&taskRemover',
			stopEditing : '&editFinisher'
		},
		template : '<ul id="todo-list">' +
			'<li ng-repeat="task in tasks | filter:mask"' +
			'	ng-class="{ completed : task.isComplete, editing : task === editing }"' +
			'	sn-edit-task="task" task-editor="editTask({outermostTask : task})">' +
			'	<div class="view">' +
			'		<input class="toggle" type="checkbox" ng-model="task.isComplete" />' +
			'		<label>{{ task.title }}</label>' +
			'		<button class="destroy" ng-click="removeTask({outermostTask : task})" />' +
			'	</div>' +
			'	<form ng-submit="stopEditing()">' +
			'		<input class="edit" ng-model="task.title" ng-blur="stopEditing()" />' +
			'	</form>' +
			'</li>' +
			'</ul>'
	}

});