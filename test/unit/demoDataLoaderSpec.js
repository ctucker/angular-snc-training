(function() {
	'use strict';

	describe('demoDataLoader', function() {
		var demoDataLoader, httpBackend, rootScope;
		var DEMO_DATA = [{title : 'first', completed: false}];

		// Pull in the "tasks" module to get our app configuration
		beforeEach(module('tasks'));

		beforeEach(inject(function(_demoDataLoader_, $rootScope, $httpBackend) {
			demoDataLoader = _demoDataLoader_;
			rootScope = $rootScope;

			httpBackend = $httpBackend;
		}));

		it('should return a promise for the data in /demo.json on success', function() {
			httpBackend.when('GET', '/demo.json').respond(DEMO_DATA);
			var demoDataPromise = demoDataLoader.loadDemoData();
			var actualData = null;

			httpBackend.flush();
			demoDataPromise.then(function(demoData) {
				actualData = demoData;
			});
			rootScope.$apply();
			expect(actualData).toEqual(DEMO_DATA);
		});

		it('should return a failing promise on failure', function() {
			httpBackend.when('GET', '/demo.json').respond(500, DEMO_DATA);
			var demoDataPromise = demoDataLoader.loadDemoData();
			var success = null;
			httpBackend.flush();
			demoDataPromise.then(
				function() {
					success = true;
				},
				function() {
					success = false;
				}
			);
			rootScope.$apply();
			expect(success).toBe(false);
		});
	});
})();