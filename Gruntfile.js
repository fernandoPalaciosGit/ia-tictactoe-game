module.exports = function (grunt) {
    'use strict';

    var timeGrunt = require('time-grunt');

    // loading apckages
    timeGrunt(grunt);
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');

    grunt.initConfig({
        jscs: {
            files: {
                src: ['js/**/*.js', 'Gruntfile.js']
            },
            options: {
                config: '.jscsrc',
                verbose: true
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['js/**/*.js', 'Gruntfile.js']
        },
        sass: {
            options: {
                outputStyle: 'compressed'
            },
            dist: {
                files: {
                    'css/main.css': 'scss/main.scss'
                }
            }
        }
    });

    grunt.registerTask('default', ['sass:dist', 'jshint', 'jscs']);
};
