module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
        options: {
            separator: ';\n'
        },
        dist: {
            files: {
                'dist/app.js': [
                    // libs
                    'vendor/CodeMirror/lib/codemirror.js',
                    'vendor/CodeMirror/addon/edit/continuelist.js',
                    'vendor/CodeMirror/mode/xml/xml.js',
                    'vendor/CodeMirror/mode/markdown/markdown.js',
                    // app
                    'js/file.js', 
                    'js/files.js', 
                    'js/app.js', 
                     // boot
                    'js/boot.js'
                ],
                'dist/chromeapp.js' : [
                    'dist/app.js',
                    'js/chromeapp.js',
                    'vendor/gapi-chrome-apps.js'
                ],
                'dist/background.js' : [
                    'js/background.js',
                ],
                'dist/webapp.js': [
                    'dist/app.js',
                    'js/webapp.js',
                    'vendor/gapi-chrome-apps.js'
                ]
            }
        }
    },
    less: {
        dist: {
            options: {
                paths: ["less", "vendor"],
                //strictImports: true
            },
            files: {
                "dist/app.css": "less/app.less"
            }
        }
    },
    copy: {
        dist: {
            files: [
                {   
                    src: ['vendor/linecons/fonts/*'], 
                    dest: 'dist/fonts', 
                    filter: 'isFile', 
                    expand: true, 
                    flatten: true
                }
            ]
        }
    },
    jade: {
        dist: {
            options: {
                data: {
                    debug: false
                }
            },
            files: {
                "dist/webapp.html": ["jade/webapp.jade"],
                "dist/chromeapp.html": ["jade/chromeapp.jade"]
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');

  grunt.registerTask('default', ['concat', 'less', 'copy', 'jade']);
};