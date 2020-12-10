/**
 * @package     BlueAcorn/GreenPistachio
 * @version     4.0.0
 * @author      Blue Acorn iCi <code@blueacorn.com>
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
import { promises as fs } from 'fs';
import { join } from 'path';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import activeThemes from '../utils/activeThemes';
import { info } from '../helpers/reporter';
import { eslintApp, eslintAll } from './eslint';
import {
    autoPathThemes,
    jsSourceFiles,
    appJsSourceFiles,
    appCodePath,
    jsWatchFiles,
    appJsWatchFiles
} from '../utils/combo';

let babelMessageSent = false;

const resolveBabelConfig = async () => {
    const babelrcPath = join(process.cwd(), '.babelrc');
    try {
        await fs.stat(babelrcPath);

        return null;
    } catch (err) {
        if (!babelMessageSent) {
            info(`.babelrc does not exist, using default configuration, please create: ${babelrcPath} for customizations`);
            info(`Example content: `);
            info(`{
    "presets": ["@babel/preset-env"]
}`);
            babelMessageSent = true;
        }

        return {
            presets: [
                ["@babel/preset-env", {
                    "targets": {
                        "browsers": "defaults"
                    }
                }]
            ]
        };
    }
};

const ExecuteBabelTasks = (files, destination, done) => {
    resolveBabelConfig().then((config) => {
        src(files, {
            allowEmpty: true
        })
            .pipe(babel(config))
            .pipe(rename((path) => {
                // eslint-disable-next-line no-param-reassign
                path.dirname = path.dirname.replace('/source', '');
            }))
            .pipe(dest(destination))
            .on('finish', done);
    });
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

task('babelAll', (done) => babelAll(done));

export const babelApp = (done) => {
    ExecuteBabelTasks(
        appJsSourceFiles(),
        appCodePath(),
        done
    );
};

task('babelApp', (done) => babelApp(done));

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
