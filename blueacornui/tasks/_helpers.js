/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     2.0.1
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

'use strict';

let taskList = require('./_taskList'),
    themes = require('../configs/_themes');

module.exports = {

    executeTask(args, type, grunt) {
        if(args[0]) {
            this.runTasks(args[0], type, grunt);
        }else{
            this.defaultRunTasks(type, grunt);
        }
    },

    runTasks(themeName, type, grunt) {
        let currentTheme = themes[themeName];

        for (let obj in taskList[type]) {

            for(let task in taskList[type][obj]) {

                // TODO
                if(task === 'copy') {
                    if(currentTheme.jsDirs.length > 0) {
                        for(let jsDir in currentTheme.jsDirs) {
                            for(let taskValue in task) {
                                grunt.task.run(task + ':' + themeName + taskValue + jsDir);
                            }
                        }
                    }
                }else{
                    grunt.task.run(task + ':' + themeName + taskList[type][obj][task]);
                }
            }
        }
    },

    defaultRunTasks(type, grunt) {
        for(let obj in taskList[type]) {
            for(let task in taskList[type][obj]) {
                grunt.task.run(task + ':' + taskList[type][obj][task]);
            }
        }
    }
};
