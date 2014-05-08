describe('todo repository', function() {
	"use strict";

	beforeEach(module('todo'));

	var endpointUrl,
		todoRepository,
		taskFactory,
		$httpBackend;

	var sysIdCounter = 0;

	beforeEach(inject(function($injector) {
		endpointUrl = $injector.get('todoEndpointUrl');
		todoRepository = $injector.get('todoRepository');
		$httpBackend = $injector.get('$httpBackend');
		taskFactory = $injector.get('taskFactory');
	}));

	describe('adding todos', function() {

		var todo, serverTodo;

		beforeEach(function() {
			todo = taskFactory.newTask('My title');
			serverTodo = serverResponseForTodo(todo);
			$httpBackend.whenPOST(endpointUrl).respond(serverTodo);
		});

		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('calls through to the correct URL', function() {
			$httpBackend.expectPOST(endpointUrl);
			todoRepository.addTodo(todo);
			$httpBackend.flush();
		});

		it('returns a promise that yields the saved todo', function() {
			var savedTodo = getSavedTodo();
			expect(savedTodo).toEqual({
				sysId : serverTodo.result.sys_id,
				isComplete : serverTodo.result.iscomplete === 'true',
				title : serverTodo.result.title
			});
		});

		function getSavedTodo() {
			var additionPromise = todoRepository.addTodo(todo);
			var savedTodo;
			additionPromise.then(function(response) {
				savedTodo = response;
			});
			$httpBackend.flush();
			return savedTodo;
		}

		function serverResponseForTodo(todo) {
			return {
				result: {
					title: todo.title,
					iscomplete: todo.complete,
					sys_id: ++sysIdCounter
				}
			}
		}

	});

});