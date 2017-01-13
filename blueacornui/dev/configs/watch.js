/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */

'use strict';

var combo  = require('./combo'),
    themes = require('./themes'),
    _      = require('underscore');

var themeOptions = {};

_.each(themes, function(theme, name) {
    themeOptions[name + "Less"] = {
        'files': [
            '<%= combo.autopath(\''+name+'\', path.pub) %>/**/*.less'
        ],
        'tasks': ['less:' + name, 'postcss:' + name],
    };

    themeOptions[name + "Js"] = {
        'files': [
            '<%= combo.autopath(\''+name+'\', path.pub) %>/**/*.js'
        ],
        'tasks': ['jshint:' + name],
    };

    themeOptions[name + "Templates"] = {
        'files': [
            '<%= combo.designpath(\''+name+'\', path.design) %>/**/*.phtml'
        ],
        'tasks': ['shell:cache:' + name],
    };

    themeOptions[name + 'SvgSprites'] = {
        files: [
            '<%= combo.designpath(\''+name+'\', path.design) %>/web/spritesrc/**/*.svg'
        ],
        tasks: ['shell:' + name + 'Sprites', 'svgmin:' + name + 'Dev', 'svg_sprite:' + name]
    };
});

var watchOptions = {
    'setup': {
        'files': '<%= path.less.setup %>/**/*.less',
        'tasks': 'less:setup'
    },
    'updater': {
        'options': {
            livereload: true
        },
        'files': '<%= path.less.updater %>/**/*.less',
        'tasks': 'less:updater'
    },
    'reload': {
        'files': '<%= path.pub %>/**/*.css',
        'options': {
            livereload: true
        }
    }
};

module.exports = _.extend(themeOptions, watchOptions);