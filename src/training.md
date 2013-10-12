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

---

# Setting up your environment

Everything you need to get started is in a Github repo, ready to clone:

``` bash
git clone http://github.com/ctucker/angular-snc-training
```

You'll also need to install NodeJS (for the testing framework):

* http://nodejs.org/ or `brew install node`

Check the instructions in the README.md file for additional info.

---

# Verifying your setup: Karma

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
</span><span class="aha-fg-red ">ERROR [reporter.osx]: </span><span class="aha-fg-white ">error: socket hang up
</span>
```

---

When everything is installed, run:
```bash
```
to start Karma.  You should see a `SUCCESS` message.

In a new tab, run:

```terminal
$ ./node_modules/protractor/bin/install_selenium_standalone
$ ./selenium/start
```

to install and run Selenium locally

Finally, in another new tab, run:

```bash
$ ./node_modules/protractor/bin/protractor protractor.conf.js
```
to run the end-to-end tests (which should fail at this stage).

---

# Let's get started!

Remember that failing protractor test from 
