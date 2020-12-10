/**
 * @package     BlueAcorn/GreenPistachio
 * @version     4.0.0
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @copyright   Copyright © Blue Acorn iCi. All rights reserved.
 */

import {
    src,
    task,
    parallel,
    series
} from 'gulp';
import eslint from 'gulp-eslint';
import path from 'path';
import activeThemes from '../utils/activeThemes';
import {
    jsSourceFiles,
    appJsSourceFiles
} from '../utils/combo';

const ExecuteEslintTasks = (files, done) => {
    src(files, {
        allowEmpty: true
    })
        .pipe(eslint({
            configFile: path.resolve(__dirname, '..', '..', '.eslintrc'),
            extends: [
                require.resolve(`${process.cwd()}/dev/tests/static/testsuite/Magento/Test/Js/_files/eslint/.eslintrc-magento`)
            ],
            resolvePluginsRelativeTo: path.resolve(__dirname, '..', '..')
        }))
        .pipe(eslint.format())
        .on('error', (error) => done(error))
        .on('done', done)
        .on('finish', done);
};

activeThemes.forEach((theme) => {
    task(`eslint.${theme.name}`, (done) => {
        ExecuteEslintTasks(
            jsSourceFiles(theme),
            done
        );
        done();
    });
});

export const eslintAll = (done) => {
    const eslintTasks = activeThemes.map((theme) => `eslint.${theme.name}`);

    return series(parallel(...eslintTasks), (seriesDone) => {
        seriesDone();
        done();
    })();
};

task('eslintAll', (done) => eslintAll(done));

export const eslintApp = (done) => {
    ExecuteEslintTasks(appJsSourceFiles(), done);
    done();
};

task('eslintApp', (done) => eslintApp(done));
