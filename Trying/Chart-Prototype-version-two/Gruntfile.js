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
			      archive: 'chart.zip'
			    },
			    files: [
			      {src: ['index.html'], dest: '/'},  
			      {src: ['package.json'], dest: '/'}, 
			      {src: ['Gruntfile.js'], dest: '/'},
			      {src: ['ReadMe.txt'], dest: '/'}, 			      
			      {src: ['svg/**'], dest: '/'}, 
			      {src: ['canvas2d/**'], dest: '/'}, 
			      {src: ['webgl/**'], dest: '/'}, 
			      {src: ['api/data.json'], dest: '/'}, 
			      {src: ['api/data.min.js'], dest: '/'}, 
			      {src: ['api/data_clean.json'], dest: '/'}, 
			      {src: ['api/data_clean.min.js'], dest: '/'}, 		
			      {src: ['css/**'], dest: '/'}, 
			      {src: ['libs/**'], dest: '/'}, 
			      {src: ['js/**'], dest: '/'}, 
			    ]
			  }
        }
    });
 
    grunt.registerTask('default', ['connect', 'open', 'watch', 'compress']);
 
}