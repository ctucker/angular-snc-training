module.exports = function(config) {
	config.set({

		basePath: '',

		frameworks: ["jasmine"],

		preprocessors: {
			'tpl/*.html': ['ng-html2js']
		},

		files: [
			'bower_components/angular/angular.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'js/**/*.js',
			'test/unit/**/*.js',
			'tpl/*.html'
		],

		autoWatch: true,

		browsers: ['Chrome'],

		reporters: ['dots', 'osx', 'growl'],

//		logLevel: config.LOG_ALL,

		plugins: [
			'karma-jasmine',
			'karma-chrome-launcher',
			'karma-osx-reporter',
			'karma-growl-reporter',
			'karma-ng-html2js-preprocessor'
		],

		ngHtml2JsPreprocessor: {
			// strip this from the file path
			//stripPrefix: 'public/',
			// prepend this to the
			//prependPrefix: 'served/',

			// or define a custom transform function
			//cacheIdFromPath: function(filepath) {
			//	return cacheId;
			//},

			// setting this option will create only a single module that contains templates
			// from all the files, so you can load them all with module('foo')
			moduleName: 'tpls'
		}

	});
};

