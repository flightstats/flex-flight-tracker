module.exports = function (grunt) {
    var config = grunt.file.readJSON('fs.json');
    console.log(config.appId, config.appKey);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                src: [
                    'src/*'
                ],
                dest: 'dist/tracker.js'
            }
        },
        uglify: {
            js: {
                files: {
                    'dist/ugly.js': ['dist/tracker.js']
                }
            }
        },
        watch: {
            files: [
                'src/*',
                'examples/*.html'
            ],
            tasks: ['concat', 'replace']
        },
        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: '__APP_ID__',
                            replacement: config.appId
                        },
                        {
                            match: '__APP_KEY__',
                            replacement: config.appKey
                        },
                        {
                            match: '../src',
                            replacement: '../../src'
                        },
                        {
                            match: '../vendor',
                            replacement: '../../vendor'
                        },
                        {
                            match: './stylesheets',
                            replacement: '.././stylesheets'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['examples/*.html'],
                        dest: 'examples/replace/'
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');
    grunt.registerTask('default', ['concat:js', 'uglify:js', 'replace']);
};