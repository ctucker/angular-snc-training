/* global angular */
'use strict';

/** Create an angular module for the tasks app */
var gTasks = angular.module('tasks', ['localStorageService']);

angular.module('tasks').value('localStorageKey', 'snc_task_list');
