module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';\n'
            },
            app: {
                files: {
                    'dist/app/app.js': [
                        // codemirror
                        'bower_components/codemirror/lib/codemirror.js',
                        'bower_components/codemirror/addon/edit/continuelist.js',
                        'bower_components/codemirror/addon/mode/overlay.js',
                        'bower_components/codemirror/mode/xml/xml.js',
                        'bower_components/codemirror/mode/javascript/javascript.js',
                        'bower_components/codemirror/mode/css/css.js',
                        'bower_components/codemirror/mode/php/php.js',
                        'bower_components/codemirror/mode/htmlmixed/htmlmixed.js',
                        'bower_components/codemirror/mode/markdown/markdown.js',
                        'bower_components/codemirror/mode/gfm/gfm.js',
                        // mousetrap
                        'bower_components/mousetrap/mousetrap.js',
                        'bower_components/mousetrap/plugins/global-bind/mousetrap-global-bind.js',
                        // marked
                        'bower_components/marked/lib/marked.js',
                        // app
                        'js/googledrive.js', 
                        'js/titlebar.js', 
                        'js/preview.js', 
                        'js/file.js', 
                        'js/fileBrowser.js', 
                        'js/app.js', 
                         // boot
                        'js/boot.js'
                    ]
                }
            },
            chromeapp: {
                files: {
                    'dist/chromeapp/app.js' : [
                            'dist/app/app.js',
                            'js/window-controls.js',
                            'js/chromeapp.js',
                            'bower_components/chrome-app-samples/gapi-chrome-apps-lib/gapi-chrome-apps.js'
                        ],
                    'dist/chromeapp/background.js' : [
                        'js/background.js',
                    ],
                }
            },
            web: {
                files: {
                    'dist/web/app.js': [
                        'dist/app/app.js',
                        'js/webapp.js',
                        'bower_components/chrome-app-samples/gapi-chrome-apps-lib/gapi-chrome-apps.js'
                    ]
                }
            }
        },
        less: {
            app: {
                options: {
                    paths: ["less", "vendor"],
                    //strictImports: true
                },
                files: {
                    "dist/app/app.css": "less/app.less"
                }
            }
        },
        copy: {
            web: {
                files: [
                    {   
                        src: ['vendor/linecons/fonts/*'], 
                        dest: 'dist/web/fonts', 
                        filter: 'isFile', 
                        expand: true, 
                        flatten: true
                    },
                    {   
                        src: ['dist/app/*.css'], 
                        dest: 'dist/web/', 
                        filter: 'isFile',
                        expand: true, 
                        flatten: true
                    }
                ]
            },
            chromeapp: {
                files: [
                    {   
                        src: ['vendor/linecons/fonts/*'], 
                        dest: 'dist/chromeapp/fonts', 
                        filter: 'isFile', 
                        expand: true, 
                        flatten: true
                    },
                    {   
                        src: ['dist/app/*.css'], 
                        dest: 'dist/chromeapp/', 
                        filter: 'isFile',
                        expand: true, 
                        flatten: true
                    },
                    {   
                        src: ['manifest.json'], 
                        dest: 'dist/chromeapp/', 
                        filter: 'isFile',
                        expand: true, 
                        flatten: true
                    }
                ]
            },
        },

        jade: {
            web: {
                files: {
                    "dist/web/index.html": ["jade/webapp.jade"],
                }
            },

            chromeapp: {
                files: {
                    "dist/chromeapp/index.html": ["jade/chromeapp.jade"]
                }
            }
        },

        watch: {
            gruntfile: {
                files: ['package.json', 'gruntfile.js'],
                tasks: ['bower', 'default']
            },
            css: {
                files: 'less/*.less',
                tasks: ['less', 'copy', 'clean:builtFinish'],
                options: {
                    //livereload: false,
                },
            },

            js: {
                files: 'js/*.js',
                tasks: ['concat', 'clean:builtFinish']
            },

            jade: {
                files: 'jade/*',
                tasks: ['jade']
            }
        },

        bower: {
            install: {
                options: {
                    copy: false,
                    //targetDir: './vendor/bower',
                    //layout: 'byType',
                    //install: true,
                    //verbose: false,
                    //cleanTargetDir: false,
                    //cleanBowerDir: flase
                }
            }
        },

        clean: {
            builtAllStart: ["dist/"],
            builtFinish: ["dist/app"]
        }


    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');


    grunt.registerTask('init', ['bower']);

    grunt.registerTask('default', ['clean:builtAllStart', 'bower', 'concat', 'less', 'jade', 'copy', 'clean:builtFinish']);

//    grunt.registerTask('web', ['bower', 'concat', 'less', 'jade', 'copy']);
//    grunt.registerTask('chromeapp', ['bower', 'concat', 'less', 'jade', 'copy']);
};