module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
 
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
        }
    });
 
    grunt.registerTask('default', ['connect', 'open', 'watch']);
 
}