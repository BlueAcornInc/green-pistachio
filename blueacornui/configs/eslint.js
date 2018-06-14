/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     2.0.1
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

'use strict';

const   path = require('path'),
        combo = require('./_combo'),
        themes = require('./_themes'),
        settings = require('./_settings');

let     themeOptions = {},
        eslintOptions = {};

eslintOptions = {
    files: {
        options: {
            configFile: 'dev/tests/static/testsuite/Magento/Test/Js/_files/eslint/.eslintrc',
            reset: true,
            useEslintrc: false
        },
        src: ''
    },
    test: {
        options: {
            configFile: 'dev/tests/static/testsuite/Magento/Test/Js/_files/eslint/.eslintrc',
            reset: true,
            outputFile: 'dev/tests/static/eslint-error-report.xml',
            format: 'junit',
            quiet: true
        },
        src: ''
    }
};

module.exports = Object.assign(themeOptions, eslintOptions);
