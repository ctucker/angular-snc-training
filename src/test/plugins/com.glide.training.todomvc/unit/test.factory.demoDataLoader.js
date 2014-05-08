describe('loading demo data', function() {
	"use strict";

	beforeEach(module('todo'));

	var $httpBackend, demoDataLoader;

	beforeEach(inject(function($injector) {
		$httpBackend = $injector.get('$httpBackend');
		demoDataLoader = $injector.get('demoDataLoader');
	}));

	beforeEach(function() {
		$httpBackend.whenGET('/api/now/table/todo_sample').respond(
			{ result : [
				{ title: 'My task', iscomplete : 'true' },
				{ title: 'Incomplete', iscomplete : 'false' }
			]}
		);
	});

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it('pulls data from the server on loadData call', function() {
		$httpBackend.expectGET('/api/now/table/todo_sample');
		demoDataLoader.loadData();
		$httpBackend.flush();
	});

	it('marks incomplete tasks as such', function() {
		var tasks = getDemoTasks();
		expect(tasks[1].isComplete).toBe(false);
	});

	it('marks complete tasks as such', function() {
		var tasks = getDemoTasks();
		expect(tasks[0].isComplete).toBe(true);
	});

	function getDemoTasks() {
		var tasks;
		demoDataLoader.loadData().then(function(data) {
			tasks = data;
		});
		$httpBackend.flush();
		return tasks;
	}


});