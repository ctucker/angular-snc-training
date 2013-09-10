/* global describe, it, expect, inject, beforeEach, module, spyOn, jasmine, angular */
'use strict';

describe('LocalStorageService', function() {

	var taskPersister,
		localStorageKey = 'snc_local_storage_test';

	beforeEach(function() {
		localStorage.clear();
	});

	beforeEach(module('localStorageService', function($provide) {
		$provide.constant('localStorageKey', localStorageKey);
	}));

	beforeEach(inject(function(_taskPersister_) {
		taskPersister = _taskPersister_;
	}));

	it('should default to returning an empty array when there are no tasks stored', function() {
		expect(taskPersister.retrieve()).toEqual([]);
	});

	it('should store an array of task objects to its localStorage key', function() {
		var taskList = [
			{ title: 'foo', completed: false }
		];
		taskPersister.store(taskList);
		expect(localStorage.getItem(localStorageKey)).toEqual(JSON.stringify(taskList));
	});

	it('should retrieve a stored array of task objects', function() {
		var taskList = [
			{ title: 'foo', completed: false }
		];
		taskPersister.store(taskList);
		expect(taskPersister.retrieve()).toEqual(taskList);
	});

	it('should strip $$hashkey out when storing', function() {
		var taskList = [
			{ title: 'foo', completed: false }
		];
		var angularTaskList = [ angular.extend({$$hashKey : 1}, taskList[0]) ];
		taskPersister.store(angularTaskList);
		expect(taskPersister.retrieve()).toEqual(taskList);
	});

});