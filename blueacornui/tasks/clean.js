/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.1
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2019, All Rights Reserved.
 */

const clean = require('gulp-clean');
const util = require('util');
const combo = require('../helpers/_combo');
const themes = require('../../gulp-config');
const DefaultRegistry = require('undertaker-registry');
const settings = require('../helpers/_settings');

function CleanTasks() {
    'use strict';

    DefaultRegistry.call(this);
};

util.inherits(CleanTasks, DefaultRegistry);

CleanTasks.prototype.init = (gulp) => {
    'use strict';

    function ExecuteCleanTasks(theme, done) {
        return gulp.src(combo.cleanPaths(theme), {
                allowEmpty: true
            })
            .pipe(clean({
                force: true,
                allowEmpty: true
            }))
            .on('end', done);
    }

    for (let theme in themes) {
        if(themes.hasOwnProperty(theme)) {
            gulp.task(`clean:${theme}`, (done) => {
                ExecuteCleanTasks(theme, done);
            });
        }
    }

    gulp.task('clean:all', (done) => {
        Object.keys(themes).map(theme => ExecuteCleanTasks(theme, done));
        done();
    });

    gulp.task(`clean:var`, (done) => {
        return gulp.src(combo.varPaths(), {
                allowEmpty: true
            })
            .pipe(clean({
                force: true,
                allowEmpty: true
            }))
            .on('end', done);
    });

    gulp.task(`clean:js`, (done) => {
        return gulp.src([
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
            .on('end', done);
    });
};

module.exports = new CleanTasks();