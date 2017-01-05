/**
* @package     BlueAcorn/GreenPistachio
* @version     4.5.0
* @author      Blue Acorn, Inc. <code@blueacorn.com>
* @copyright   Copyright © 2016 Blue Acorn, Inc.
*/


var combo  = require('./combo'),
    themes = require('./themes'),
    path   = require('./path'),
    _      = require('underscore');

var themeOptions = {};

_.each(themes, function(theme, name) {
    if(theme.grunt && theme.dev_url) {
        themeOptions[name + 'Dev'] = {
            bsFiles: {
                src: [
                    combo.autopath(name, path.pub) + '**/*.css',
                    combo.autopath(name, path.pub) + '**/*.js',
                    combo.designpath(name, path.design) + '**/*.phtml'
                ]
            },
            options: {
                watchTask: true,
                proxy: theme.dev_url
            }
        }
    }
});

var browserSyncOptions = {};

module.exports = _.extend(themeOptions, browserSyncOptions);
