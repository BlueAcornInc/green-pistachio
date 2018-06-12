/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     2.0.1
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

'use strict';

const path = require('path'),
      combo = require('./_combo'),
      themes = require('./_themes'),
      settings = require('./_settings');

let   themeOptions = {},
      pngSpriteOptions;

for(const name in themes) {
    let theme = themes[name];

    if(theme.grunt) {
        themeOptions[name] = {
            src: combo.autoPathSpriteSrc(name) + '**/*.png',
            dest: combo.autoPathImageSrc(name) + 'spritesheet.png',
            destCss: combo.autoPathThemeCss(name) + '/blueacorn/_png-sprite.less',
            imgPath: '../images/spritesheet.png',
            cssTemplate: path.join(__dirname, '../assets/tmpl/_png-sprite-mixins.less')
        };
    }
}

pngSpriteOptions = {
    options: {

    }
};

module.exports = Object.assign(themeOptions, pngSpriteOptions);
