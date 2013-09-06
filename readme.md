# ServiceNow Angular Training

For the training sessions we'll be building up a ToDo manager app,
based on the templates provided at
[http://todomvc.com](http://todomvc.com).

## Getting Started

To get started, you need to have *NodeJS* installed.  You can either
install this via HomeBrew, or download Node directly from the
[NodeJS website](http://nodejs.org).

Next, clone this repository using your favorite Git tool.  From the
command-line, you can use:

	$ git clone http://github.com/ctucker/angular-snc-training

At this point you should have everything you need to develop an
angular app and run tests against it.  To verify, go into the
`angular-snc-training` directory and run:

	$ ./node_modules/karma/bin/karma start --single-run

You should see an instance of Chrome flash up in the background, and
get a report on the command line that ends with something like:

	Executed 1 of 1 SUCCESS (1.807 secs / 0.008 secs)

Congratulations, you just ran a unit test!

## Running tests in the background

It's a pain to have to run tests manually all the time, so it's best
to have karma launch itself in the background and just keep on
running.  It'll watch for file changes and automatically run your
tests when you change your code.  To do this, run:

	$ ./node_modules/karma/bin/karma start

If you're no OS X you'll also get a notification pop up telling you
that tests are passing or failing.  If you want to stop the tests
running, just ctrl-c out of the process.


## Launching a local site

It's best to run everything over a "real" HTTP server rather than the
filesystem to avoid any potential problems with XHR requests.  To
launch a local server simply run:

	$ ./node_modules/http-server/bin/http-server -p 8000 -c-1

This will launch an http server on port 8000 with caching disabled.
You can access the app by navigating to
[http://localhost:8000/](http://localhost:8000).
