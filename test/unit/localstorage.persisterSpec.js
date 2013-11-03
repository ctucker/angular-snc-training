(function() {
	'use strict';

	describe('localstorage persister', function () {

		var persister;
		var TEST_KEY = "localstorage.persister.test";
		var TEST_OBJ = { bool : true, str : "str", num : 1 };


		beforeEach(module('localstorage'));

		beforeEach(inject(function(_persister_) {
			persister = _persister_;
			localStorage.clear();
		}));

		it('should save an object out to localstorage', function() {
			persister.save(TEST_KEY, TEST_OBJ);
			var storedJson = localStorage.getItem(TEST_KEY);

			expect(angular.fromJson(storedJson)).toEqual(TEST_OBJ);
		});

		it('should retrieve an object from localstorage', function() {
			var testObjJson = angular.toJson(TEST_OBJ);
			localStorage.setItem(TEST_KEY, testObjJson);

			expect(persister.load(TEST_KEY)).toEqual(TEST_OBJ);
		});
	});

})();
