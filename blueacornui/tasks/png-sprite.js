/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.1
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2019, All Rights Reserved.
 */

const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const path = require('path');
const util = require('util');
const combo = require('../helpers/_combo');
const themes = require('../../gulp-config');
const DefaultRegistry = require('undertaker-registry');

function PngSpriteTasks() {
    'use strict';

    DefaultRegistry.call(this);
}

util.inherits(PngSpriteTasks, DefaultRegistry);

PngSpriteTasks.prototype.init = (gulp) => {
    'use strict';

    const config = {
        cssName: "_png-sprites.less",
        imgName: "spritesheet.png",
        cssTemplate: path.join(__dirname, "../assets/tmpl/_png-sprite-mixins.less")
    };

    function ExecutePngSpriteTasks(theme, done) {
        let spriteData = gulp.src('**/*.png', {
                            cwd: combo.autoPathSpriteSrc(theme)
                        }).pipe(spritesmith(config));

        let imgStream = spriteData.img
                        .pipe(gulp.dest(combo.autoPathImageSrc(theme)))
                        .on('end', done);

        let cssStream = spriteData.css
                        .pipe(gulp.dest(`${combo.autoPathThemeCss(theme)}blueacorn/`))
                        .on('end', done);

        return merge(imgStream, cssStream);
    }

    for (let theme in themes) {
        if (themes.hasOwnProperty(theme)) {
            gulp.task(`png-sprite:${theme}`, (done) => {
                ExecutePngSpriteTasks(theme, done);
            });
        }
    }

    gulp.task('png-sprite:all', (done) => {
        Object.keys(themes).map(theme => ExecutePngSpriteTasks(theme, done));
    });
};

module.exports = new PngSpriteTasks();