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
    series,
    parallel,
    task
} from 'gulp';
import clean from 'gulp-clean';
import settings from '../utils/settings';
import { cleanPaths } from '../utils/combo';
import activeThemes from '../utils/activeThemes';

/**
 * Clean Execution Task
 * @param theme
 * @param done
 * @returns {*}
 * @constructor
 */
const ExecuteCleanTasks = (files, done) => {
    src(files, {
        allowEmpty: true
    })
        .pipe(clean({
            force: true,
            allowEmpty: true
        }))
        .on('end', done)
        .on('finish', done);
};

/**
 * Cleans JS Files when spinning up Gulp
 * @param done
 * @returns {*}
 */
export const cleanJs = (done) => {
    src([
        `${settings.pub}**/*.js`,
        `${settings.pub}**/*.html`,
        `${settings.pub}_requirejs/**/*`,
        `${settings.deployedVersion}`
    ], {
        allowEmpty: true
    })
        .pipe(clean({
            force: true,
            allowEmpty: true
        }))
        .on('end', done)
        .on('finish', done);
};

activeThemes.forEach((theme) => {
    task(`clean.${theme.name}`, (done) => {
        ExecuteCleanTasks(
            cleanPaths(theme),
            done
        );
    });
});

/**
 * Cleans all Themes
 * @param done
 */
export const cleanAll = (done) => {
    const cleanTasks = activeThemes.map((theme) => `clean.${theme.name}`);

    return series(parallel(...cleanTasks), (seriesDone) => {
        seriesDone();
        done();
    })();
};
