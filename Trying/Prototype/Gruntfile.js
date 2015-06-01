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
                path: 'http://localhost/www/Diplarbeit/joan/Trying/Prototype/'
            }
        },
        compress: {
			 main: {
			    options: {
			      archive: 'Prototype.zip'
			    },
			    files: [
			      {src: ['svg/**'], dest: '/'}, 
			      {src: ['canvas/**'], dest: '/'}, 
			      {src: ['webgl/**'], dest: '/'}, 
			      {src: ['api/**'], dest: '/'}, 
			      {src: ['css/**'], dest: '/'}, 
			      {src: ['libs/**'], dest: '/'}, 
			      {src: ['js/**'], dest: '/'}, 
			    ]
			  }
        }
    });
 
    grunt.registerTask('default', ['connect', 'open', 'watch', 'compress']);
 
}