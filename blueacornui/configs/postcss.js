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
    themeOptions = {};

for(let name in themes) {
    let theme = themes[name];

    if(theme.grunt) {

        themeOptions[name] = {
            options: {
                map: apOptions.dev.map,
                processors: [
                    require('autoprefixer')({
                        browsers: apOptions.dev.options.browsers,
                        map: apOptions.dev.options.map,
                        add: true,
                        remove: true
                    })
                ]
            },
            src: combo.autoPrefixerFiles(name)
        };

        themeOptions[name + 'Production'] = {
            options: {
                map: apOptions.production.map,
                processors: [
                    require('autoprefixer')({
                        browsers: apOptions.production.options.browsers,
                        map: apOptions.production.options.map,
                        add: true,
                        remove: true
                    })
                ]
            },
            src: combo.autoPrefixerFiles(name)
        };

    }
}

module.exports = themeOptions;
