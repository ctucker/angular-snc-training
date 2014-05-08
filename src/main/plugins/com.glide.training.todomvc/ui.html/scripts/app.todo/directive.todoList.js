angular.module('todo').directive('snTodoList', function() {
	"use strict";

	return {
		restrict: 'E',
		replace : true,
		template : '<ul id="todo-list">' +
			'<li ng-repeat="task in taskList | filter:statusMask"' +
			'	ng-class="{ completed : task.isComplete, editing : task === taskBeingEdited }"' +
			'	sn-edit-task="task">' +
			'	<div class="view">' +
			'		<input class="toggle" type="checkbox" ng-model="task.isComplete" />' +
			'		<label>{{ task.title }}</label>' +
			'		<button class="destroy" ng-click="deleteTask(task)" />' +
			'	</div>' +
			'	<form ng-submit="finishEditing()">' +
			'		<input class="edit" ng-model="task.title" ng-blur="finishEditing()" />' +
			'	</form>' +
			'</li>' +
			'</ul>'
	}

});