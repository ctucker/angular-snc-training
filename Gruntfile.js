
module.exports = function(grunt) {

    grunt.initConfig({

	includes : {
	    files : {
		src: ['src/training.html'],
		dest: 'slideshow/training.html'
	    }
	},

	copy : {
	    files : {
		cwd: 'src',
		expand: true,
		src: ['**/*', '!training.*'],
		dest: 'slideshow/'
	    }
	},

	watch : {
	    includes : {
		files : ['src/*'],
		tasks : ['copy', 'includes'],
		options: {
		    livereload: true
		}
	    }
	}
	    
    });

    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['copy', 'includes']);
}