module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';\n'
            },
            vendor: {
                files: {
                    'dist/build/vendor.js': [
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
                        // markdown-js
                        'bower_components/markdown/lib/markdown.js',
                        // spin.js
                        'bower_components/spin.js/dist/spin.js',
                        // filepicker-webview
                        // 'vendor/filepicker-webview/filepicker-0.0.1.js',
                        // github
                        'bower_components/github/lib/base64.js',
                        'bower_components/github/lib/underscore-min.js',
                        'bower_components/github/github.js'
                    ]
                },
            },
            gapi: {
                files: {
                    'dist/build/gapi.js': [
                        'bower_components/chrome-app-samples/gapi-chrome-apps-lib/gapi-chrome-apps.js'
                    ]
                }
            }
        },
        sass: {
            app: {
                files: {
                    "dist/build/app.css": "sass/app.sass"
                }
            },
            web: {
                files: {
                    "dist/web/landingpage.css": "sass/landingpage.sass"
                }
            }
        },
        copy: {
            web: {
                files: [
                    {   
                        src: ['vendor/linecons/fonts/*'], 
                        dest: 'dist/web/app/fonts', 
                        filter: 'isFile', 
                        expand: true, 
                        flatten: true
                    },
                    {   
                        src: ['dist/build/*.js'], 
                        dest: 'dist/web/app', 
                        filter: 'isFile', 
                        expand: true, 
                        flatten: true
                    },
                    {   
                        src: [
                            'dist/build/app.css', 
                            'bower_components/codemirror/lib/codemirror.css',
                            'vendor/filepicker-webview/callback.html'
                        ], 
                        dest: 'dist/web/app', 
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
                        src: ['dist/build/*.js'], 
                        dest: 'dist/chromeapp', 
                        filter: 'isFile', 
                        expand: true, 
                        flatten: true
                    },
                    {   
                        src: [
                            'dist/build/app.css', 
                            'bower_components/codemirror/lib/codemirror.css', 
                            'manifest.json', 
                            'icon/icon_128.png', 
                            'icon/icon_16.png', 
                            'icon/icon_48.png'
                        ], 
                        dest: 'dist/chromeapp/', 
                        filter: 'isFile',
                        expand: true, 
                        flatten: true
                    },

                ]
            },
        },

        jade: {
            web: {
                files: {
                    "dist/web/index.html": ["jade/landingpage.jade"],
                    "dist/web/app/index.html": ["jade/webapp.jade"]                
                }
            },

            chromeapp: {
                files: {
                    "dist/chromeapp/index.html": ["jade/chromeapp.jade"]
                }
            }
        },

        coffee: {
            web: {
                options: {
                    sourceMap: true
                },
                files: {
                    'dist/web/app/app.js': [
                        'coffee/drive.coffee', 
                        'coffee/titlebar.coffee', 
                        'coffee/documents.coffee', 
                        'coffee/slides.coffee', 
                        'coffee/preview.coffee', 
                        'coffee/info.coffee', 
                        'coffee/document.coffee', 
                        'coffee/app.coffee', 
                        'coffee/webapp.coffee'
                    ]
                }
            },
            chromeapp: {
                options: {
                    sourceMap: true
                },
                files: {
                    'dist/chromeapp/app.js': [
                        'coffee/drive.coffee', 
                        'coffee/titlebar.coffee', 
                        'coffee/documents.coffee', 
                        'coffee/slides.coffee', 
                        'coffee/preview.coffee', 
                        'coffee/info.coffee', 
                        'coffee/document.coffee', 
                        'coffee/app.coffee', 
                        'coffee/chromeWindow.coffee',
                        'coffee/chromeapp.coffee'
                    ],
                    'dist/chromeapp/background.js': [
                        'coffee/background.coffee', 
                    ],
                    'dist/chromeapp/chromewebview.js': [
                        'coffee/chromewebview.coffee'
                    ],
                }
            }
        },

        watch: {
            gruntfile: {
                files: ['package.json', 'gruntfile.js'],
                tasks: ['bower', 'build']
            },
            sass : {
                files: 'sass/*.sass',
                tasks: ['sass', 'copy', 'clean:builtFinish'],
                options: {
                    //livereload: false,
                },
            },
            js: {
                files: 'js/*.js',
                tasks: ['concat', 'clean:builtFinish']
            },

            coffee: {
                files: 'coffee/*.coffee',
                tasks: ['coffee', 'clean:builtFinish']
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
            builtFinish: ["dist/build"]
        },

        connect: {
            server : {
                options: {
                    port: 8000,
                    //hostname: 'schreiber-dev.k94n.com',
                    base: 'dist/web'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('build', [
        'clean:builtAllStart', 
        'bower', 
        'sass',
        'jade', 
        'coffee', 
        'concat',
        'copy', 
        'clean:builtFinish'
    ]
    );

    grunt.registerTask('serve',
        ['build', 'connect', 'watch']
    );

    grunt.registerTask('default', 'build'); 

//    grunt.registerTask('web', ['bower', 'concat', 'sass', 'jade', 'copy']);
//    grunt.registerTask('chromeapp', ['bower', 'concat', 'sass', 'jade', 'copy']);
};