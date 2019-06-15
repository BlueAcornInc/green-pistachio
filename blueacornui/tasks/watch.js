/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.0
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

const livereload = require('gulp-livereload');
const util = require('util');
const combo = require('../helpers/_combo');
const themes = require('../../gulp-config');
const DefaultRegistry = require('undertaker-registry');

function WatchTasks() {
    'use strict';

    DefaultRegistry.call(this);
}

util.inherits(WatchTasks, DefaultRegistry);

WatchTasks.prototype.init = (gulp) => {
    'use strict';

    let tasks = [];

    for (let theme in themes) {
        if (themes.hasOwnProperty(theme) && themes[theme].gulp) {

            gulp.task(`watch:${theme}Less`, () => {
                gulp.watch(combo.lessWatchFiles(theme), gulp.series(`less:${theme}`));
            });

            tasks.push(`watch:${theme}Less`);

            gulp.task(`watch:${theme}Images`, () => {
                gulp.watch(combo.imgWatchFiles(theme), gulp.series(`imagemin:${theme}`));
            });

            tasks.push(`watch:${theme}Images`);

            gulp.task(`watch:${theme}Js`, () => {
                gulp.watch(combo.jsSourceFiles(theme), gulp.series(`eslint:${theme}`, `babel:${theme}`));
            });

            tasks.push(`watch:${theme}Js`);

            gulp.task(`watch:${theme}Templates`, () => {
                gulp.watch(combo.templateWatchFiles(theme), gulp.series(`exec:cache`));
            });

            tasks.push(`watch:${theme}Templates`);
        }
    }

    gulp.task(`watch:app`, () => {
        gulp.watch(combo.appWatchFiles(), gulp.series(`exec:cache`));
        gulp.watch(combo.appLessWatchFiles(), gulp.series('less:admin'));
    });

    tasks.push('watch:app');

    gulp.task(`watch:appJs`, () => {
        gulp.watch(combo.appWatchJsFiles(), gulp.series('babel:app'));
    });

    tasks.push('watch:appJs');

    gulp.task('watch:all', gulp.parallel(tasks));

    gulp.task('livereload', (done) => {
        livereload.listen();
        done();
    });

    gulp.task('watch', gulp.series('livereload', gulp.parallel('watch:all')));
};

module.exports = new WatchTasks();