var gulp = require('gulp');
var karma = require('gulp-karma');
var gulpProtractor = require("gulp-protractor");
var protractor = gulpProtractor.protractor;
var webdriver_standalone = gulpProtractor.webdriver_standalone;
var webdriver_update = gulpProtractor.webdriver_update;

gulp.task('webdriver-standalone', webdriver_standalone);
gulp.task('webdriver-update', webdriver_update);

gulp.task('protractor', function() {
	return gulp.src(["./src/test/plugins/*/e2e/**/*.js"])
		.pipe(protractor({
			configFile: "./protractor.conf.js"
		}))
		.on('error', function(e) {
			throw e
		});
});

gulp.task('test', function() {
	return gulp.src()
});

gulp.task('default', ['protractor']);