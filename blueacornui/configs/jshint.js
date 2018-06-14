/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     2.0.1
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

'use strict';

const combo = require('./_combo'),
      themes = require('./_themes');

let themeOptions = {},
    jshintOptions = {
        options: {
            jshintrc: combo.rootPath() + 'blueacornui/.jshintrc'
        }
    };

for(let name in themes) {
    if(themes[name].grunt) {
        themeOptions[name] = {
            files: {
                src: combo.jsThemeSourceFiles(name)
            }
        };
    }
}

themeOptions['appCode'] = {
    files: {
        src: combo.jsAppCodeSourceFiles()
    }
};

module.exports = Object.assign(jshintOptions, themeOptions);
