module.exports = function (grunt) {
    'use strict';

    var timeGrunt = require('time-grunt'),
        targetJS = ['js/**/*.js', 'Gruntfile.js'];

    // loading apckages
    timeGrunt(grunt);
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');

    grunt.initConfig({
        jscs: {
            files: {
                src: targetJS
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
            all: targetJS
        },
        eslint: {
            options: {
                format: require('eslint-tap'),
                configFile: 'eslint.json',
                quiet: true
            },
            target: targetJS
        },
        sass: {
            options: {
                sourceMap: false,
                outputStyle: 'compressed'
            },
            dist: {
                files: {
                    'css/main.css': 'scss/main.scss'
                }
            }
        }
    });

    grunt.registerTask('default', ['sass:dist', 'jshint', 'jscs', 'eslint']);
};
