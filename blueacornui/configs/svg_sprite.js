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
    if(theme.grunt) {
        themeOptions[name] = {
            expand: true,
            cwd: combo.designpath(name, path.design) + 'web/spritesrc/',
            src: '**/*.svg',
            dest: combo.designpath(name, path.design) + 'web/src/',
            options: {
                svg: {
                    xmlDeclaration: true,
                    doctypeDeclaration: true,
                    namespaceIDs: true,
                    namespaceClassnames: true,
                    dimensionAttributes: true,
                    precision: 2
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
                                dest: '../css/source/blueacorn/_sprites.less'
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
                                dest: '../css/source/blueacorn/_sprites-view.less'
                            }
                        }
                    }
                }
            }
        };
    }
});

var svgspriteOptions = {
    options: {

    }
};

module.exports = _.extend(themeOptions, svgspriteOptions);
