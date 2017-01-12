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
        themeOptions[name + 'Dev'] = {
            files: [{
                expand: true,
                cwd: combo.designpath(name, path.design) + 'web/images/',
                src: ['**/*.svg', '*.svg'],
                dest: combo.designpath(name, path.design) + 'web/images/'
            }]
        }

        themeOptions[name + 'Sprites'] = {
            files: [{
                expand: true,
                cwd: combo.designpath(name, path.design) + 'web/spritesrc/',
                src: ['**/*.svg', '*.svg'],
                dest: combo.designpath(name, path.design) + 'web/spritesrc/'
            }]
        }
    }
});

var svgminOptions = {
    options: {
        plugins: [
            {
                removeViewBox: false
            },{
                removeUselessStrokeAndFill: false
            }
        ]
    }
};

module.exports = _.extend(themeOptions, svgminOptions);
