#!/bin/bash


function selenium() {
    if [[ -e selenium && ! -d selenium ]]
    then
	echo "Error: cannot build selenium dir, file with same name already exists"
	echo "Remove the selenium file and try again"
	exit 1
    fi

    if [[ ! -d selenium ]]
    then
	echo "Installing Selenium"
	./node_modules/protractor/bin/install_selenium_standalone
    fi

    ./selenium/start
}

function tests() {
    ./node_modules/protractor/bin/protractor protractor.conf.js
}

function usage {
    cat >/dev/stdout <<EOF
$0 [selenium|run] - run Protractor tests

Configure and launch selenium or run the protractor tests.

Examples:
   Ensure selenium is avaialble, installing it if necessary, and launch
   it, ready for protractor test execution
       $0 selenium

   Run the protractor tests:
       $0 run
   ("run" is the default, and therefore optional)
EOF
    exit 1
}

command=$1
if [[ -z $command ]]
then
    command=run
fi

case "$command" in
    selenium)
	selenium
	;;
    run)
	tests
	;;
    *)
	usage
	;;
esac
