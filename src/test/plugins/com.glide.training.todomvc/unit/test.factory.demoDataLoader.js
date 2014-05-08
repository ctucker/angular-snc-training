describe('loading demo data', function() {
	"use strict";

	beforeEach(module('todo'));

	var demoDataLoader,
		demoDataUrl,
		$httpBackend;

	beforeEach(inject(function($injector) {
		demoDataLoader = $injector.get('demoDataLoader');
		demoDataUrl = $injector.get('demoDataUrl');
		$httpBackend = $injector.get('$httpBackend');
	}));

	beforeEach(function() {
		$httpBackend.whenGET(demoDataUrl).respond(
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

	it('pulls data from the server on loadDemoData call', function() {
		$httpBackend.expectGET(demoDataUrl);
		demoDataLoader.retrieveDemoData();
		$httpBackend.flush();
	});

	it('yields tasks with the correct titles', function() {
		var tasks = getDemoTasks();
		expect(tasks.length).toBe(2);
		expect(tasks[0].title).toEqual('My task');
		expect(tasks[1].title).toEqual('Incomplete');
	});

	it('yields completed tasks with an isComplete status of true', function() {
		var tasks = getDemoTasks();
		expect(tasks[0].complete).toBe(true);
	});

	it('yields incomplete tasks with an isComplete status of false', function() {
		var tasks = getDemoTasks();
		expect(tasks[1].complete).toBe(false);
	});

	function getDemoTasks() {
		var demoData;
		demoDataLoader.retrieveDemoData().then(function (result) {
			demoData = result;
		});
		$httpBackend.flush();
		return demoData;
	}
});