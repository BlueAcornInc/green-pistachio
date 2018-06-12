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
        jscsOptions = {};

for(let name in themes) {
    let theme = themes[name];

    if(theme.grunt) {

    }
}

jscsOptions = {
    file: {
        options: {
            config: 'dev/tests/static/testsuite/Magento/Test/Js/_files/jscs/.jscsrc'
        },
        src: ''
    },
    test: {
        options: {
            config: 'dev/tests/static/testsuite/Magento/Test/Js/_files/jscs/.jscsrc',
            reporterOutput: 'dev/tests/static/jscs-error-report.xml',
            reporter: 'junit'
        },
        src: ''
    }
};

module.exports = Object.assign(themeOptions, jscsOptions);
