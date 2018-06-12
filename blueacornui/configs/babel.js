/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     2.0.1
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

'use strict';

let combo = require('./_combo'),
    themes = require('./_themes'),
    apOptions = require('./_autoprefixer'),
    themeOptions = {},
    babelOptions = {
        options: {
            presets: [
                [
                    combo.getNodeModulesDir() + '/babel-preset-env',
                    {
                        target: {
                            browsers: apOptions.dev.browsers
                        },
                        debug: false,
                        modules: false
                    }
                ]
            ],
            minified: true,
        }
    };

for(let name in themes) {
    let theme = themes[name];

    if(theme.grunt) {
        themeOptions[name] = {
            options: {
                sourceMap: false,
                sourceType: 'script',
                compact: false,
                minified: false
            },
            files: combo.jsSourceFiles(name)
        };
    }
}

themeOptions['appCode'] = {
    options: {
        sourceMap: false,
        sourceType: 'script',
        compact: false,
        minified: false
    },
    files: combo.jsAppCodeBabelSourceFiles()
};

module.exports = Object.assign(babelOptions, themeOptions);
