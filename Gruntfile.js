
module.exports = function(grunt) {

    grunt.initConfig({

	includes : {
	    files : {
		src: ['src/training.html'],
		dest: 'slideshow/training.html'
	    }
	},

	watch : {
	    includes : {
		files : ['src/*'],
		tasks : ['includes'],
		options: {
		    livereload: true
		}
	    }
	}
	    
    });

    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['includes']);
}