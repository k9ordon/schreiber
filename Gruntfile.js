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
                    'js/boot.js',
                    'vendor/gapi-chrome-apps.js'
                ],
                'dist/chrome.js': ['js/chrome.js']
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
                    dest: 'dist/fonts/', 
                    filter: 'isFile', 
                    expand: true, 
                    flatten: true
                }
            ]
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['concat', 'less', 'copy']);
};