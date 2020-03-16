/**
 * @package     BlueAcorn/GreenPistachio
 * @version     4.0.0
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @author      Michael Bottens <michael.bottens@blueacorn.com>
 * @copyright   Copyright © Blue Acorn iCi. All rights reserved.
 */

import path from 'path';
import merge from 'merge-stream';
import {
    src,
    dest,
    series,
    parallel,
    task,
    watch
} from 'gulp';
import spriteSmith from 'gulp.spritesmith';
import activeThemes from '../utils/activeThemes';
import {
    imageminSrc,
    pngSpriteFiles,
    autoPathThemes
} from '../utils/combo';

const config = {
    cssName: 'web/css/source/blueacorn/_png-sprites.less',
    imgName: 'spritesheet.png',
    imgPath: 'web/src/',
    cssTemplate: path.join(__dirname, '../assets/tmpl/_png-sprite-mixins.less')
};

const ExecutePngSpriteTasks = (theme, themeCwd, themeDest, done) => {
    src('web/spritesrc/**/*.png', {
        cwd: themeCwd
    })
        .pipe(spriteSmith(config))
        .pipe(dest(autoPathThemes(theme)))
        .on('end', done);
};

activeThemes.forEach((theme) => {
    task(`pngSprite.${theme.name}`, (done) => {
        ExecutePngSpriteTasks(
            theme,
            autoPathThemes(theme),
            imageminSrc(theme),
            done
        );
    });
});

export const pngSpriteAll = (done) => {
    const spriteTasks = activeThemes.map((theme) => `pngSprite.${theme.name}`);

    return series(parallel(...spriteTasks), (seriesDone) => {
        seriesDone();
        done();
    })();
};

task('pngSpriteAll', (done) => pngSpriteAll(done));

export const watchPngSprites = (done) => {
    watch(pngSpriteFiles(), (done) => pngSpriteAll(done));
};
