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
                path: 'http://localhost/www/Diplarbeit/joan/Trying/Chart-Prototype-version-two/'
            }
        },
        compress: {
			 main: {
			    options: {
			      archive: 'lineDetection.zip'
			    },
			    files: [
				  {src: ['ReadMe.txt'], dest: 'lineDetection/'},
			      {src: ['index.html'], dest: 'lineDetection/'},  
			      {src: ['package.json'], dest: 'lineDetection/'}, 
			      {src: ['Gruntfile.js'], dest: 'lineDetection/'}, 
			      {src: ['svg/**'], dest: 'lineDetection/'}, 
			      {src: ['canvas2d/**'], dest: 'lineDetection/'}, 
			      {src: ['webgl/**'], dest: 'lineDetection/'}, 
			      {src: ['api/data.json'], dest: 'lineDetection/'}, 
			      {src: ['api/data.min.js'], dest: 'lineDetection/'}, 
			      {src: ['api/data_clean.json'], dest: 'lineDetection/'}, 
			      {src: ['api/data_clean.min.js'], dest: 'lineDetection/'}, 		
			      {src: ['css/**'], dest: 'lineDetection/'}, 
			      {src: ['libs/**'], dest: 'lineDetection/'}, 
			      {src: ['js/**'], dest: 'lineDetection/'}, 
			    ]
			  }
        }
    });
 
    grunt.registerTask('default', ['connect', 'open', 'watch', 'compress']);
 
}