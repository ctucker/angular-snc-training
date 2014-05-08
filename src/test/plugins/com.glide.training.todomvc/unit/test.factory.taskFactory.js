describe('task creation', function() {
	"use strict";

	beforeEach(module('todo'));

	var taskFactory;
	beforeEach(inject(function($injector) {
		taskFactory = $injector.get('taskFactory');
	}));

	it('creates tasks with the given title', function() {
		expect(taskFactory.newTask('Title').title).toBe('Title');
	});

	it('creates tasks with no completion status in the incomplete state', function() {
		expect(taskFactory.newTask('Title').complete).toBe(false);
	});

	it('creates tasks with a truthy completion status in the complete state', function() {
		expect(taskFactory.newTask('Title', 7).complete).toBe(true);
	});

	it('creates tasks with a falsy completion status in the incomplete state', function() {
		expect(taskFactory.newTask('Title', 0).complete).toBe(false);
	});

});