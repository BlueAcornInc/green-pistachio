/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     2.0.1
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

module.exports = function(grunt) {
    'use strict';

    let path = require('path'),
        helper = require('./_helpers');

    grunt.registerTask('prod', 'Prepare Theme for Deployment', function() {
            helper.executeTask(arguments, 'prod', grunt);
            grunt.task.run('watch');
    });

    grunt.registerTask('production', 'Prepare Theme for Deployment', function() {
            helper.executeTask(arguments, 'prod', grunt);
            grunt.task.run('watch');
    });
};
