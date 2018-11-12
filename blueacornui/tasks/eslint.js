/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.0
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

const eslint = require('gulp-eslint');
const util = require('util');
const combo = require('../helpers/_combo');
const themes = require('../../gulp-config');
const DefaultRegistry = require('undertaker-registry');

function EsLintTasks() {
    'use strict';

    DefaultRegistry.call(this);
}

util.inherits(EsLintTasks, DefaultRegistry);

EsLintTasks.prototype.init = (gulp) => {
    'use strict';

    function ExecuteEsLintTasks(src, done) {
        gulp.src(src)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());

        done();
    }

    for (let theme in themes) {
        if(themes.hasOwnProperty(theme)) {
            gulp.task(`eslint:${theme}`, (done) => {
                ExecuteEsLintTasks(combo.jsSourceFiles(theme), done);
            });
        }
    }

    gulp.task('eslint:all', (done) => {
        Object.keys(themes).map(theme => ExecuteEsLintTasks(combo.jsSourceFiles(theme), done));
    });
};

module.exports = new EsLintTasks();