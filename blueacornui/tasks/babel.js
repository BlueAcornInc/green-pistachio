/**
 * @package     BlueAcorn/GreenPistachio
 * @version     4.0.0
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @author      Michael Bottens <michael.bottens@blueacorn.com>
 * @copyright   Copyright © Blue Acorn iCi. All rights reserved.
 */

import {
    src,
    dest,
    series,
    parallel,
    task,
    watch
} from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import activeThemes from '../utils/activeThemes';
import { eslintApp, eslintAll } from './eslint';
import {
    autoPathThemes,
    jsSourceFiles,
    appJsSourceFiles,
    appCodePath,
    jsWatchFiles,
    appJsWatchFiles
} from '../utils/combo';

const ExecuteBabelTasks = (files, destination, done) => {
    src(files, {
        allowEmpty: true
    })
        .pipe(babel())
        .pipe(rename((path) => {
            // eslint-disable-next-line no-param-reassign
            path.dirname = path.dirname.replace('/source', '');
        }))
        .pipe(dest(destination))
        .on('finish', done);
};

activeThemes.forEach((theme) => {
    task(`babel.${theme.name}`, (done) => {
        ExecuteBabelTasks(
            jsSourceFiles(theme),
            autoPathThemes(theme),
            done
        );
    });
});

export const babelAll = (done) => {
    const babelTasks = activeThemes.map((theme) => `babel.${theme.name}`);

    return series(parallel(...babelTasks), (seriesDone) => {
        seriesDone();
        done();
    })();
};

export const babelApp = (done) => {
    ExecuteBabelTasks(
        appJsSourceFiles(),
        appCodePath(),
        done
    );
};

export const watchJs = (done) => {
    watch(jsWatchFiles(), (done) => series(eslintAll, babelAll, (seriesDone) => {
        seriesDone();
        done();
    })());
};

export const watchAppJs = (done) => {
    watch(appJsWatchFiles(), (done) => series(eslintApp, babelApp, (seriesDone) => {
        seriesDone();
        done();
    })());
};
