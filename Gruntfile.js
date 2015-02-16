module.exports = function(grunt) {
    // 配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'jshint': {
            all: {
                src: 'AForm.js',
                options: {
                    //bitwise: true,
                    camelcase: true,
                    //curly: true,
                    //eqeqeq: true,
                    forin: true,
                    //immed: true,
                    indent: 4,
                    latedef: true,
                    newcap: true,
                    noarg: true,
                    noempty: true,
                    nonew: true,
                    regexp: true,
                    //undef: true,
                    //unused: true,
                    //trailing: true,
                    maxlen: 420
                }
            }
        },
        'jsdoc': {
            src: ['AForm.js'],
            options: {
                destination: 'doc'
            }
        },
		'serve': {
	        options: {
	            port: 9000
	        }
	    }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-serve');

    // 注册任务
    grunt.registerTask('default', ['jsdoc']);
}

