/**
 * @package     BlueAcorn/GreenPistachio
 * @version     4.0.0
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @copyright   Copyright © Blue Acorn iCi. All rights reserved.
 */

import { src, dest, task, series, parallel, watch } from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import livereload from 'gulp-livereload';
import chalk from 'chalk';
import less from 'gulp-less';
import activeThemes from '../utils/activeThemes';
import { lessFiles, lessWatchFiles } from '../utils/combo';

const ExecuteLessTask = (theme, files, destination, done) => {
    src(files)
        .pipe(sourcemaps.init())
        .pipe(less().on('error', (error) => {
            console.log(chalk.red(`Error compiling ${theme.name}:\n\n${error.message}`));
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(destination))
        .pipe(livereload())
        .on('finish', done);
};

activeThemes.forEach((theme) => {
    if (theme.stylesheets.length > 0) {
        task(`less.${theme.name}`, (done) => {
            lessFiles(theme).map((lessFile) => ExecuteLessTask(
                theme,
                lessFile,
                `${lessFile.substring(0, lessFile.lastIndexOf('/'))}`,
                done
            ));
        });
    }
});

export const lessAll = (done) => {
    const lessTasks = activeThemes.map((theme) => `less.${theme.name}`);

    return series(parallel(...lessTasks), (seriesDone) => {
        seriesDone();
        done();
    })();
};

task('lessAll', (done) => lessAll(done));

export const watchLess = (done) => {
    watch(lessWatchFiles(), (done) => lessAll(done));
};
