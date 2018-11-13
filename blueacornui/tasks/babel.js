/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.0
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

const babel = require('gulp-babel');
const rename = require('gulp-rename');
const util = require('util');
const combo = require('../helpers/_combo');
const themes = require('../../gulp-config');
const DefaultRegistry = require('undertaker-registry');

function BabelTasks() {
    'use strict';

    DefaultRegistry.call(this);
}

util.inherits(BabelTasks, DefaultRegistry);

BabelTasks.prototype.init = (gulp) => {
    'use strict';

    function ExecuteBabelTasks(theme, src, dest, done) {
        gulp.src(src)
            .pipe(babel({
                presets: [`env`]
            }))
            .pipe(rename(path => {
                path.dirname = path.dirname.replace('/source', '');
            }))
            .pipe(gulp.dest(dest))
            .on('end', done);
    }

    for (let theme in themes) {
        if (themes.hasOwnProperty(theme)) {
            gulp.task(`babel:${theme}`, (done) => {
                ExecuteBabelTasks(theme, combo.jsSourceFiles(theme), combo.autoPathThemes(theme), done);
            });
        }
    }

    gulp.task('babel:all', (done) => {
        Object.keys(themes).map(theme => 
            ExecuteBabelTasks(theme, combo.jsSourceFiles(theme), combo.autoPathThemes(theme), done));
    });
};

module.exports = new BabelTasks();