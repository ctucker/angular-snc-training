(function() {
	'use strict';

	describe('angularjs homepage', function() {
		var ptor;

		beforeEach(function() {
			ptor = protractor.getInstance();
		});

		it('should be able to load the index page', function() {
			ptor.get('/');
		});

	});


})();