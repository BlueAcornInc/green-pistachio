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
    themeOptions = {},
    commonOptions = {
        interupt: true,
        reload: false,
        livereload: false,
        spawn: false
    };

for(let name in themes) {
    let theme = themes[name];

    if(theme.grunt) {

        themeOptions[name + 'Less'] = {
            files: combo.lessWatchFiles(name),
            tasks: ['css:' + name],
            options: commonOptions
        };

        themeOptions[name + 'Css'] = {
            files: combo.cssWatchFiles(name),
            options: {
                livereload: combo.getLiveReload(name)
            }
        };

        themeOptions[name + 'Img'] = {
            files: combo.imgWatchFiles(name),
            tasks: ['concurrent:' + name + 'MinifyImages']
        };

        themeOptions[name + 'SvgSprite'] = {
            files: combo.svgSpriteWatchFiles(name),
            tasks: ['svg_sprite:' + name]
        };

        themeOptions[name + 'PngSprite'] = {
            files: combo.pngSpriteWatchFiles(name),
            task: ['sprite:' + name]
        };

        themeOptions[name + 'Js'] = {
            files: combo.jsThemeSourceFiles(name),
            tasks: ['jshint:' + name, 'babel:' + name]
        };
    }
}

themeOptions['themeTemplates'] = {
    files: combo.themeTemplateWatchFiles(),
    tasks: ['exec:cache'],
    options: commonOptions
};

themeOptions['appCode'] = {
    files: combo.appCodeWatchFiles(),
    tasks: ['exec:cache'],
    options: commonOptions
};

themeOptions['appCodeJs'] = {
    files: combo.jsAppCodeSourceFiles(),
    tasks: ['jshint:appCode', 'babel:appCode']
};

module.exports = themeOptions;
