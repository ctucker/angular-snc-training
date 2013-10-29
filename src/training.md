class: center, middle, title

# Introduction to AngularJS

## An overview of the Angular framework

---

# How this will be organized

* Combination of three styles:
	* Lecture-style overviews of aspects of Angular
	* Live development of features by instructor
	* Paired-up implementation of features by all of you

* Testing is an integral part of the course

* Code is all in a github repo, with supporting scripts to jump about
  in history

---

# Setting up your environment

Everything you need to get started is in a Github repo, ready to clone:

```terminal
$ git clone http://github.com/ctucker/angular-snc-training
```

You'll also need to install NodeJS (for the testing framework):

* http://nodejs.org/ or `brew install node`

Check the instructions in the README.md file for additional info.

---

layout: true
.step-name[start-here]

---

# Tagged steps

There is a script, `load-step.sh` that can be used to load each stage
of the training application.

On the slides, you'll see a green box that indicates what stage you
should have loaded for that particular slide.

`./load-step.sh --help` to get help.

---

# Karma test runner

We run all of our unit tests using Karma.  Verify it works like so:

```terminal
$ ./node_modules/karma/bin/karma start 
<span class="aha-fg-green ">INFO [reporter.osx]: </span><span class="aha-fg-white ">OSX Notification Center reporter started at http://localhost:1337
</span><span class="aha-fg-green ">INFO [karma]: </span><span class="aha-fg-white ">Karma v0.10.2 server started at http://localhost:9876/
</span><span class="aha-fg-green ">INFO [launcher]: </span><span class="aha-fg-white ">Starting browser Chrome
</span><span class="aha-fg-yellow ">WARN [watcher]: </span><span class="aha-fg-white ">Pattern &quot;/Users/ctucker/dev/js/angular-snc-training/tpl/*.html&quot; does not match any file.
</span><span class="aha-fg-yellow ">WARN [reporter.growl]: </span><span class="aha-fg-white ">No running version of GNTP found.
Make sure the Growl service is installed and running.
For more information see https://github.com/theabraham/growly.
</span><span class="aha-fg-green ">INFO [reporter.osx]: </span><span class="aha-fg-white ">node-osx-notifier exited with code 8
</span><span class="aha-fg-green ">INFO [Chrome 30.0.1599 (Mac OS X 10.8.5)]: </span><span class="aha-fg-white ">Connected on socket R1mFdn9VnQW6vTRaKq9N
.
Chrome 30.0.1599 (Mac OS X 10.8.5): Executed 1 of 1</span><span class="aha-fg-green "> SUCCESS</span><span class="aha-fg-white "> (0.823 secs / 0.008 secs)
</span>
```

* Default Chrome installed by ServiceNow IT is ancient and doesn't
work, so if you have Chrome errors download and re-install (update
within Chrome will *not* work).

---

# Local web server

Although we could do most everything using file urls, we'll be
spinning up a local HTTP server.  This is easily done:

```terminal
$ ./http-server.sh
<span class="aha-fg-yellow ">Starting up http-server, serving </span><span class="aha-fg-white "></span><span class="aha-fg-cyan ">./</span><span class="aha-fg-white "></span><span class="aha-fg-yellow "> on port: </span><span class="aha-fg-white "></span><span class="aha-fg-cyan ">8000</span><span class="aha-fg-white ">
Hit CTRL-C to stop the server
```

You'll need the web server up for the next steps, running e2e tests with protractor

---

# End-to-end: Selenium server

Our end-to-end tests are written using Protractor, which is a thin
Angular-aware wrapper written around Selenium.

To get ready to Selenium ready to go, run:
```terminal
$ ./protractor.sh selenium
Installing Selenium
When finished, start the Selenium Standalone Server with ./selenium/start

downloading http://selenium.googlecode.com/files/selenium-server-standalone-2.35.0.jar...
downloading https://chromedriver.googlecode.com/files/chromedriver_mac32_2.2.zip...
chromedriver_mac32_2.2.zip downloaded to ./selenium/chromedriver_mac32_2.2.zip
selenium-server-standalone-2.35.0.jar downloaded to ./selenium/selenium-server-standalone-2.35.0.jar
Oct 12, 2013 1:57:57 PM org.openqa.grid.selenium.GridLauncher main
INFO: Launching a standalone server
Setting system property webdriver.chrome.driver to ./selenium/chromedriver
...
```

---

# End-to-end: Protractor

Now you can run the actual Protractor tests with:

```terminal
$ ./protractor.sh
Using the selenium server at http://localhost:4444/wd/hub
<span class="aha-fg-red ">F</span>

Failures:

  1) angularjs homepage should be able to load the index page
   Message:
     <span class="aha-fg-red ">Error: Angular could not be found on the page http://localhost:8000/</span>
   Stacktrace:
     Error: Angular could not be found on the page http://localhost:8000/
    at /Users/ctucker/dev/js/angular-snc-training/node_modules/protractor/lib/protractor.js:298:15
...

Finished in 10.39 seconds
<span class="aha-fg-red ">1 test, 1 assertion, 1 failure
</span>
```

Note that while the tests run, they currently fail!

---

# WebStorm / IntelliJ users

Run configs are provided to launch from within IDE.

Add the configurations with:
```terminal
$ cp -a intellij/runConfigurations .idea/runConfigurations
```

You'll then see them in the run menu:

.center[![Run Configurations](images/runConfigurations.png)]

---

# First steps

That failing test is no good.  Let's make it pass!

Recall the error:
```terminal
<span class="aha-fg-red ">Error: Angular could not be found on the page http://localhost:8000/</span>
```

The solution is to add Angular to the page, which we'll do now.

---

layout: true
.step-name[part1-step1]

---

# Adding behavior, test-first

Let's add a simple feature:

* When I type into the input box, the label in the final `<li>` on the
  page should receive the value I type

We'll write a Protractor test to look for that behavior now, and then
add the code to make it pass.

---

layout: true
.step-name[part1-step2]

---

# A brief tour of Angular bindings

* `ng-model="newTask"` adds a newTask variable to the `root` scope
* `{{ newTask }}` binds that variable into the HTML
* Angular takes care of updating the bound value when the scope value
  is changed

.middle[.center[![newTask binding](images/newTask-Scope.png)]]

---

# $watch(), $apply(), and $digest()

.fullsize[![Angular Lifecycle](images/angularLifecycle.svg)]

---

layout: true
.step-name[part1-step3]

---

# Only add the task on enter

Right now we update the task title in place.  We want to only do
this when the user hits enter.

Steps:

1. Update our e2e test to expect a form submission
2. Introduce a controller to capture the entry when it's added and
   bind it into the UI

We'll quickly walk through updating the test to make it fail, then
we'll look at what a controller test looks like and you will make it
pass.

---

# Making it pass: the Controller

Go through the test step-by-step:

1. Add a `$scope.newTask` variable to hold your newly entered task
2. Add a `$scope.taskList` variable that holds a list of tasks
3. Add a `$scope.addTask()` function that will add your new task on to
   the task list

This is all just plain-old JavaScript: the only thing to remember is
that `$scope` in your controller is the same thing as `scope` in the
test.

---

# Making it pass: the HTML

There are a few things to do here:

* Tell Angular the name of your app module with `ng-app=tasks`
* Add your controller to the todo-app section container with
  `ng-controller=TasksController`
* Wrap the `new-todo` input in a form
* Update the model and binding to reflect the `newTask.title` variable
* Add an `ng-submit` to the form to call the `addTask()` function
* Make sure you add the `tasksController.js` file to the scripts at
  the bottom of the page!

---

layout: true
.step-name[part1-step4]

---

# Adding multiple tasks

The controller currently lets you add multiple tasks, but we do
nothing with them.

We want to:

1. Verify in our `todoListSpec` that adding an item to the list causes a
   new item to be added to the UI (this will .red[fail])
2. Verify that our controller adds new tasks to the end of the task
   list (this will .green[pass])
3. Change the HTML to make the `todoListSpec` pass

---

# Multiple tasks e2e

Add a failing test to the `todoListSpec.js` that:

1. Adds two items to the todo-list by sending keys and submitting the
   `new-todo` input
  * Use taskInput.clear() to blank out the input 
2. Verifies that the HTML now has two `<li>` elements under the
   `#todo-list` `<ul>` for the new entries

To get at the list of DOM elements for assertion, use the form:

```javascript
ptor.findElements(selector).then(
	function(foundItems) { ... }
)
```

---

layout: true
.step-name[part1-step5]

---

# Multiple tasks controller spec

Add a passing test to the `tasksControllerSpec.js` that:

1. Adds two tasks to the list using `scope.newTask` and
   `scope.addTask()`
2. Verifies that the task list has both tasks in the right order

This should be a very simple test!

---

layout: true
.step-name[part1-step6]

---

# Multiple tasks HTML

We need to repeat elements on the page so we'll use the `ng-repeat`
directive.


Usage:
```html
<li ng-repeat="«name» in «scope variable»">
	...
	{{ «name».«property» }}
	...
</li>
```

* After making your change, run your e2e tests
* You may need to adjust the first test now the list is "correct" (I did)

---

layout: true
.step-name[part1-step7]

---

# A little bit about Directives

* Directives in Angular are the only thing that can manipulate the DOM
* We've now seen a few built-in directives:
  * `ng-controller`: connect a controller and set up a new scope
  * `ng-model`: bind a model value to an input
  * `ng-submit`: set a form-submission handler
  * `ng-repeat`: repeat a DOM template for every element in a list
* Directives allow us to *extend* HTML with custom markup
  * Applied as elements, attributes, CSS classes, or comments

---

# Cleaning up the UI

There are still a couple of niggling UI issues:

1. We should clear the input after submitting the form
2. We should strip leading and trailing whitespace for task titles
3. We should not allow the submission of an empty or undefined task

Write tests and implementation for each of these in turn, using what we've
learned so far.

You can trust Angular, so test at the controller level.

---

layout: true
.step-name[part1-complete]

---

# Part 1: Complete!

We're all done with part 1: we have a working, if not fully featured,
todo-list application!

.center[![Part1 Complete](images/part1-complete-screen.png)]


---

layout: true
.step-name[part2-start]

---

class: center, middle, title

# $watch and $apply

### Custom lifecycle management

---

# Warm up: marking tasks complete

Clicking the check mark next to a task should mark it completed and
set the `<li>` class to `completed`.

To conditionally set a class, use the `ng-class` directive on the `<li>`

```javascript
ng-class="{ «class_name» : «boolean expression» }"
```
You should:

* Track completion status of each task
* Use an `ng-model` binding on checkbox to set status
* Use `ng-class` to set the class based

---

layout: true
.step-name[part2-step1]

---

# Warm up: deleting tasks

Mouse over the right side of the task to see a red X.

Clicking the red X should delete the task from the list.

You should:

* Add a (tested) `deleteTask` function to your controller
* Invoke it using an `ng-click` directive on the delete button
* Skip the e2e test (Protractor has issues with `:hover`)

---

layout: true
.step-name[part2-step2]

---

# Recall $watch/$apply/$digest

.fullsize[![Angular Lifecycle](images/angularLifecycle.svg)]

---

# $scope.$watch

You can watch for changes with $scope.$watch:
```javascript
$scope.$watch('expr', function() {...}, useEquals)
```

* `expr` : any Angular expression.  It will be evaluated on each digest
  loop and, if it has changed, trigger the...
* `function() {...}` : callback function to execute when the watch
  changes
* `useEquals` : flag to indicate a reference or a deep-equality
  comparison

---

# $scope.$apply

In normal operation, Angular will automatically call `$apply` on any
DOM event.

However...if you manipulate the DOM without Angular knowing, you will
have to manually call `$scope.$apply()` for Angular to digest your
changes.

This is particularly common in tests.

---

# Conditionally hiding the footer

One of our requirements is to only show the footer when there are
entries in the todo list.

We'll implement this as before in a test-driven  fashion by:

1. Writing an e2e test to verify the footer is not visible when there
   are no entries, and is visible when there are entries
2. Adding a test and behavior to our controller to manage a flag for
   "entries are present"
3. Updating the HTML to make the e2e test pass

---
