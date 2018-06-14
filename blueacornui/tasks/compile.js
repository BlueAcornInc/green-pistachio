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

    grunt.registerTask('compile', 'Build Theme for Development', function() {
        helper.executeTask(arguments, 'compile', grunt);
    });
};
