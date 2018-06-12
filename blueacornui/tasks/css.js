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
        themes = require('../configs/_themes'),
        configDir = '../configs',
        helper = require('./_helpers');

    grunt.registerTask('css', 'Build Theme CSS', function() {
        helper.executeTask(arguments, 'css', grunt);
    });

    grunt.registerTask('cssProd', 'Build Theme CSS for Production', function() {
        helper.executeTask(arguments, 'cssProd', grunt);
    });
};
