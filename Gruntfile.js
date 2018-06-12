/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     2.0.1
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

const gruntSetup = function(grunt) {
    'use strict';

    var path = require('path'),
        themes = require('./blueacornui/configs/_themes.js'),
        configDir = './blueacornui/configs',
        taskDir = './blueacornui/tasks/',
        tasks = [
            'production'
            'prod',
            'compile',
            'dev',
            'css',
            'img',
            'js'
        ],
        defaultTasks;

    /**
     * Instantiate `time-grunt` to display task performance.
     */
    require('time-grunt')(grunt);

    /**
     * Register each task with grunt.
     * TODO: Create once tasks have been created.
     */
    tasks.forEach(function(task, idx) {
        require(taskDir + task)(grunt);
    });

    /**
     * Instantiate `load-grunt-config` to automatically load
     * configuration files from `configDir`.
     */
    require('load-grunt-config')(grunt, {
        configPath: path.join(__dirname, configDir),
        init: true,
        jitGrunt: {
            staticMappings: {
                browsersync: 'browserSync',
                sprite: 'grunt-spritesmith'
            }
        }
    });

    defaultTasks = {

        // Default Task that Runs grunt-watch
        default() {
            for(let name in themes) {
                if(themes[name].grunt) {
                    grunt.task.run('clean:' + name);
                    grunt.task.run('exec:' + name);
                    grunt.task.run('concurrent:' + name + 'Sprite');
                    grunt.task.run('concurrent:' + name + 'Compile');
                }
            }
            grunt.task.run('jshint:appCode');
            grunt.task.run('babel:appCode');
            grunt.task.run('watch');
        },

        noexec() {
            for(let name in themes) {
                if(themes[name].grunt) {
                    grunt.task.run('concurrent:' + name + 'Sprite');
                    grunt.task.run('concurrent:' + name + 'Compile');
                }
            }
            grunt.task.run('jshint:appCode');
            grunt.task.run('babel:appCode');
            grunt.task.run('watch');
        },

        sync(name) {
            grunt.task.run('concurrent:' + name + 'Sprite');
            grunt.task.run('concurrent:' + name + 'Compile');
            grunt.task.run('jshint:appCode');
            grunt.task.run('babel:appCode');
            grunt.task.run('browserSync');
            grunt.task.run('watch');
        }

        // TODO: SETUP TASK
        // TODO: SYNC TASK
    };

    for(let taskName in defaultTasks) {
        grunt.registerTask(taskName, defaultTasks[taskName]);
    }
};

module.exports = gruntSetup;
