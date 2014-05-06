# ServiceNow Angular Training

For the training sessions we'll be building up a ToDo manager app,
based on the templates provided at
[http://todomvc.com](http://todomvc.com).

## Prerequisites

To get started, you need to have *NodeJS* installed.  You can either
install this via HomeBrew, or download Node directly from the
[NodeJS website](http://nodejs.org).

	$ brew install node

Next, clone this repository using your favorite Git tool.  From the
command-line, you can use:

	$ git clone http://github.com/ctucker/angular-snc-training

If you're using Eclipse you can import the project from the `.project`
file.  If you're using IntelliJ, import the
`angular-training-2014.iml` file.  For Sublime or other text editors,
open up the source tree as you normally would.

At this point you should have everything you need to develop an
angular app and run tests against it.  To verify, go into the
`angular-snc-training` directory and run:

	$ ./node_modules/karma/bin/karma start --single-run

You will see an instance of Chrome flash up in the background, and
get a report on the command line that ends with something like:

	Executed 1 of 1 SUCCESS (1.807 secs / 0.008 secs)

If Chrome doesn't launch, verify the version you are running.  It
should be Chrome 33 or newer; if it is not, either update to the
latest or, if you're using the version that came with your machine
from IT, delete it and reinstall to ensure you get updates promptly in
the future.

Congratulations, you just ran a unit test!

## Simplifying node runs

If you want to make it a bit easier to run your node commands (karma,
protractor, gulp) you can install them as a global dependency and add
the node bin directory to your path:

	$ npm install -g karma protractor gulp
	$ echo 'export PATH=$PATH:/usr/local/share/npm/bin' >> ~/.bashrc

You can now run karma, gulp, and protractor without the
`./node_modules/<name>/bin/<exec>` nonsense.

## Tying in to ServiceNow

The code is organized much as a standard ServiceNow plugin is
organized.  We will be running the code from within ServiceNow by
installing this as a plugin.

You'll need to adjust your run configuration to find the plugin. 
(In Eclipse you'll find the VM Arguments by going to Run -> Run Configurations,
Under Java Application select GlideOrbit, VM Arguments are located 
in the Arguments tab.)

In your launch config's VM arguments, add:

	-Dglide.security.policy=none

to disable the security manager (so you can load a plugin from outside
the Glide project root).  Then add to the end of your
`glide.plugins.directories` the path to your checked out code.  For
example:

	-Dglide.plugins.directories=...,/Users/ctucker/git/training/src/main/plugins

Where `...`  is your existing path, if any.  Note that plugin
directory paths are separated by _commas_, not semi-colons.

With this set up, launch you local glide instance and navigate to the
Plugins page.  Search for com.glide.training.todomvc, and install it.

Once this is done you should be able to navigate to
http://localhost:8080/$todo.do and see the start of the todo app.
This should be marked as a public page and therefore not require
login.

## Running tests in the background

It's a pain to have to run tests manually all the time, so it's best
to have karma launch itself in the background and just keep on
running.  It'll watch for file changes and automatically run your
tests when you change your code.  To do this, run:

	$ ./node_modules/karma/bin/karma start

If you're on OS X you'll also get a notification pop up telling you
that tests are passing or failing.  If you want to stop the tests
running, just ctrl-c out of the process.

Note that if you use IntelliJ 13 you can run the karma tests
continuously from within the IDE.  For Eclipse, Sublime, or other
editors running in the terminal is probably your best bet.

## Running end-to-end tests

Karma is used for running unit tests; for end-to-end (browser) tests,
we'll be using Protractor.  To run protractor you need to:

1. Start up a selenium server
2. Launch the protractor runner

To start the selenium server, open a new tab in your terminal,
navigate to the root of this directory, and run:

	$ gulp webdriver-standalone

If you receive errors about not being able to launch selenium, try
running:

	$ gulp webdriver-update

and then repeating the webdriver-standalone launch.

To run the tests themselves, run:

	$ gulp protractor

The tests will fail at this stage; don't worry, we'll deal with that
during the training!
