module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
  	grunt.loadNpmTasks('grunt-contrib-compress');
 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: './'
                }
            }
        },
        typescript: {
            base: {
                src: ['js/*.ts'],
                dest: 'js/app-ts.js',
                options: {
                    module: 'amd',
                    target: 'es5'
                }
            }
        },
        watch: {
            files: 'js/*.ts',
            tasks: ['typescript']
        },
        open: {
            dev: {
                path: 'http://localhost/www/Diplarbeit/joan/Trying/Graphics-Libs/'
            }
        },
        compress: {
			 main: {
			    options: {
			      archive: 'graphicLibs.zip'
			    },
			    files: [
			      {src: ['index.html'], dest: 'graphicLibs/'},  
			      {src: ['package.json'], dest: 'graphicLibs/'}, 
			      {src: ['Gruntfile.js'], dest: 'graphicLibs/'}, 
			      {src: ['api/**'], dest: 'graphicLibs/'}, 	      
			      {src: ['examples/**'], dest: 'graphicLibs/'}, 	
			      {src: ['css/**'], dest: 'graphicLibs/'}, 
			      {src: ['libs/**'], dest: 'graphicLibs/'}, 
			      {src: ['js/**'], dest: 'graphicLibs/'}, 
			    ]
			  }
        }
    });
 
    grunt.registerTask('default', ['connect', 'open', 'watch', 'compress']);
 
}