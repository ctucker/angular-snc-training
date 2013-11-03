(function() {
	'use strict';

	describe('taskList', function() {

		var taskList;

		beforeEach(module('tasks'));

		beforeEach(inject(function(_taskList_) {
			taskList = _taskList_;
		}));

		describe('setting task list', function() {
			it('should replace the existing task list with a new one', function() {
				taskList.addTask('Old task');
				taskList.addTask('Other old task');

				taskList.setTaskList([{title: 'New task', complete : false}]);

				expect(taskList.tasks[0].title).toBe('New task');
				expect(taskList.tasks.length).toBe(1);
			});

			it('should make a defensive copy of the task list', function() {
				var newTaskList = [{title : 'New task', complete : false}];
				taskList.setTaskList(newTaskList);

				newTaskList[0].complete = true;

				expect(taskList.tasks[0].complete).toBe(false);
			});

			it('should no-op if new task list is null', function() {
				taskList.addTask('task');
				taskList.setTaskList(null);
				expect(taskList.tasks[0].title).toBe('task');
			});

			it('should no-op if new task list is undefined', function() {
				taskList.addTask('task');
				taskList.setTaskList(void(0));
				expect(taskList.tasks[0].title).toBe('task');
			});

		});
	});
})();