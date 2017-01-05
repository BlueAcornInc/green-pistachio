/**
* @package     BlueAcorn/GreenPistachio
* @version     4.5.0
* @author      Blue Acorn, Inc. <code@blueacorn.com>
* @copyright   Copyright © 2016 Blue Acorn, Inc.
*/

'use strict';

var combo  = require('./combo'),
    themes = require('./themes'),
    _      = require('underscore'),
    ap = require('./autoprefixer');

var themeOptions = {};

_.each(themes, function(theme, name) {
    themeOptions[name] = {
        options: {
            map: ap.dev.map,
            processors: [
                require('autoprefixer')({
                    browsers: ap.dev.options.browsers,
                    map: ap.dev.options.map,
                    add: true,
                    remove: true
                })
            ]
        },
        dist: {
            src: combo.lessFiles(name)    
        }
    };
});

var postCssOptions = {

};

module.exports = _.extend(themeOptions, postCssOptions);