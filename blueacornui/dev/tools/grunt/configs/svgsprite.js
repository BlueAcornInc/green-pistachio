/**
* @package     BlueAcorn/GreenPistachio
* @version     4.5.0
* @author      Blue Acorn, Inc. <code@blueacorn.com>
* @copyright   Copyright © 2016 Blue Acorn, Inc.
*/

var combo  = require('./combo'),
    themes = require('./themes'),
    _      = require('underscore');

var themeOptions = {};

_.each(themes, function(theme, name) {
    if(theme.grunt) {
        themeOptions[name + 'Dev'] = {
            expand: true,
            cwd: combo.autopath(name, 'library') + 'spritesrc/',
            src: '**/*.svg',
            dest: combo.autopath(name, 'library') + 'src/',
            options: {
                svg: {
                    xmlDeclaration: true,
                    doctypeDeclaration: true,
                    namespaceIDs: true,
                    namespaceClassnames: true,
                    dimensionAttributes: true
                },
                shape: {
                    dimension: {
                        maxWidth: 500,
                        maxHeight: 500
                    },
                    spacing: {
                        padding: 0
                    },
                    dest: '../src/intermediate-svg'
                },
                mode: {
                    symbol: {
                        dest: '../css/',
                        prefix: '.svg-',
                        bust: false,
                        sprite: '../images/sprites.svg',
                        render: {
                            less: {
                                dest: '../less/00_base/_sprites.less'
                            }
                        }
                    },
                    view: {
                        dest: '../css/',
                        prefix: '.svg-view-',
                        bust: false,
                        sprite: '../images/sprites.view.svg',
                        mixin: 'svg-view',
                        common: 'svg-view',
                        render: {
                            less: {
                                dest: '../less/00_base/_sprites-view.less'
                            }
                        }
                    }
                }
            }
        };
    }
});

var svgminOptions = {
    options: {

    }
};

module.exports = _.extend(themeOptions, svgminOptions);
