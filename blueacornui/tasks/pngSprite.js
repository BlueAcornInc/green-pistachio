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
    themeCssPath,
    imageminSrc,
    spriteSourceFiles,
    pngSpriteFiles
} from '../utils/combo';

const config = {
    cssName: '_png-sprites.less',
    imgName: 'spritesheet.png',
    cssTemplate: path.join(__dirname, '../assets/tmpl/_png-sprite-mixins.less')
};

const ExecutePngSpriteTasks = (theme, themeCwd, themeDest, done) => {
    const spriteData = src('**/*.png', {
        cwd: themeCwd
    }).pipe(spriteSmith(config));

    const imgStream = spriteData.img
        .pipe(dest(themeDest))
        .on('end', done);

    const cssStream = spriteData.css
        .pipe(dest(themeCssPath(theme)))
        .on('end', done);

    return merge(imgStream, cssStream);
};

activeThemes.forEach((theme) => {
    task(`pngSprite.${theme.name}`, (done) => {
        ExecutePngSpriteTasks(
            theme,
            spriteSourceFiles(theme),
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

export const watchPngSprites = (done) => {
    watch(pngSpriteFiles(), (done) => pngSpriteAll(done));
};
