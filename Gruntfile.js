module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';\n'
            },
            vendor: {
                files: {
                    'dist/app/vendor.js': [
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
                        // marked
                        'bower_components/spin.js/dist/spin.js'
                    ]
                },
            },
            app: {
                files: {
                    'dist/app/app.js': [
                        // app
                        'js/googledrive.js', 
                        'js/titlebar.js', 
                        'js/info.js', 
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
                    'dist/web/app/app.js': [
                        'dist/app/vendor.js',
                        'dist/app/app.js',
                        'js/webapp.js'
                    ],
                    'dist/web/landingpage.js': ['js/landingpage.js']
                }
            },
            coffee: {
                files: {
                    'dist/web/app/coffee-lib.js': [
                        'dist/app/vendor.js',
                        //'dist/app/coffee.js'
                    ],
                    'dist/web/landingpage.js': ['js/landingpage.js']
                }
            }
        },
        less: {
            chromeapp: {
                options: {
                    paths: ["less", "vendor"],
                    //strictImports: true
                },
                files: {
                    "dist/chromeapp/app.css": "less/app.less"
                }
            },
            web: {
                options: {
                    paths: ["less", "vendor"],
                    //strictImports: true
                },
                files: {
                    "dist/web/app/app.css": "less/app.less", "dist/web/landingpage.css": "less/landingpage.less"
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
                        src: ['manifest.json', 'icon/icon_128.png', 'icon/icon_16.png', 'icon/icon_48.png'], 
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
                    "dist/web/index.html": ["jade/landingpage.jade"],
                    "dist/web/app/coffee.html": ["jade/coffee.jade"],
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
                    'dist/web/app/coffee.js': [
                        'coffee/titlebar.coffee', 
                        'coffee/drive.coffee', 
                        'coffee/documents.coffee', 
                        'coffee/preview.coffee', 
                        'coffee/document.coffee', 
                        'coffee/app.coffee', 
                        'coffee/webapp.coffee'
                    ]
                }
            }
        },

        watch: {
            gruntfile: {
                files: ['package.json', 'gruntfile.js'],
                tasks: ['bower', 'build']
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
            builtFinish: ["dist/app"]
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
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-coffee');

    grunt.registerTask('build', [
        'clean:builtAllStart', 
        'bower', 
        'less', 
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

//    grunt.registerTask('web', ['bower', 'concat', 'less', 'jade', 'copy']);
//    grunt.registerTask('chromeapp', ['bower', 'concat', 'less', 'jade', 'copy']);
};