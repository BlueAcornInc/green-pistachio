/**
 * @package     BlueAcorn/GreenPistachio
 * @version     4.0.0
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @author      Michael Bottens <michael.bottens@blueacorn.com>
 * @copyright   Copyright © Blue Acorn iCi. All rights reserved.
 */

import {
    task,
    src,
    dest,
    series,
    parallel,
    watch
} from 'gulp';
import imagemin from 'gulp-imagemin';
import activeThemes from '../utils/activeThemes';
import {
    imageminSrc,
    autoPathImages,
    imageWatchSrcFiles
} from '../utils/combo';

const ExecuteImageminTasks = (theme, done) => {
    src(`${imageminSrc(theme)}**/*.{png,jpg,gif,jpeg,svg,jpeg}`)
        .pipe(imagemin([
            imagemin.gifsicle(),
            imagemin.mozjpeg(),
            imagemin.optipng({ optimizationLevel: 7 }),
            imagemin.svgo()
        ]))
        .pipe(dest(autoPathImages(theme)))
        .on('end', done);
};

activeThemes.forEach((theme) => {
    task(`imagemin.${theme.name}`, (done) => {
        ExecuteImageminTasks(
            theme,
            done
        );
    });
});

export const imageminAll = (done) => {
    const imageminTasks = activeThemes.map((theme) => `imagemin.${theme.name}`);

    return series(parallel(...imageminTasks), (seriesDone) => {
        seriesDone();
        done();
    })();
};

task('imageminAll', (done) => imageminAll(done));

export const watchImages = (done) => {
    watch(imageWatchSrcFiles(), (done) => imageminAll(done));
};
