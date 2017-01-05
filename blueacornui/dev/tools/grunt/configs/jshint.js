/**
* @package     BlueAcorn/GreenPistachio
* @version     4.5.0
* @author      Blue Acorn, Inc. <code@blueacorn.com>
* @copyright   Copyright © 2016 Blue Acorn, Inc.
*/

'use strict';

var combo  = require('./combo'),
    themes = require('./themes'),
    path   = require('./path'),
    _      = require('underscore');

var themeOptions = {};

_.each(themes, function(theme, name) {
    if(theme.grunt) {
        var fileOptions = [combo.autopath(name, path.pub) + '/BlueAcorn*/**/*.js'];

        themeOptions[name] = {
            files: {
                src: fileOptions
            }
        };
    }
});

var jshintOptions = {
    options: {
        "globals": {
            "jQuery": true,
            "prototypejs": true,
            "$": true,
            "$$": true,
            "$j": true
        },
        "evil": true,
        "expr": true,
        "nonew": true,
        "newcap": false
    }
};

module.exports = _.extend(themeOptions, jshintOptions);
