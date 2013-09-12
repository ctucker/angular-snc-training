/* global describe, it, expect, inject, beforeEach, module, spyOn, jasmine */
'use strict';

describe('TaskListFactory', function() {

	var taskListFactory;

	beforeEach(module('tasks'));

	beforeEach(inject(function(_taskListFactory_) {
		taskListFactory = _taskListFactory_;
	}));

	it('should create a new entry with existing tasks when given a task list argument', function() {
		var tasks = [ { title : 'task', completed : false } ];
		var taskList = taskListFactory(tasks);

		expect(taskList.tasks).toEqual(tasks);
	});

});