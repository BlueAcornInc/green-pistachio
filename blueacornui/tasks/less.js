/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.0
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

const less = require('gulp-less');
const livereload = require('gulp-livereload');
const util = require('util');
const combo = require('../helpers/_combo');
const themes = require('../../gulp-config');
const DefaultRegistry = require('undertaker-registry');
const sourcemaps = require('gulp-sourcemaps');

function LessTasks() {
    'use strict';

    DefaultRegistry.call(this);
}

util.inherits(LessTasks, DefaultRegistry);

LessTasks.prototype.init = (gulp) => {
    'use strict';

    function ExecuteLessTasks(theme, done) {
        gulp.src(combo.lessFiles(theme))
            .pipe(sourcemaps.init())
            .pipe(less())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(`${combo.autoPathAssets(theme)}/css`))
            .pipe(livereload())
            .on('end', done);
    }

    for (let theme in themes) {
        if(themes.hasOwnProperty(theme)) {
            gulp.task(`less:${theme}`, (done) => {
                ExecuteLessTasks(theme, done);
            });
        }
    }

    gulp.task('less:all', (done) => {
        Object.keys(themes).map(theme => ExecuteLessTasks(theme, done));
    });
};

module.exports = new LessTasks();