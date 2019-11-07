/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.1
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2019, All Rights Reserved.
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
            .pipe(eslint.format());

        done();
    }

    for (let theme in themes) {
        if(themes.hasOwnProperty(theme)) {
            gulp.task(`eslint:${theme}`, (done) => {
                ExecuteEsLintTasks(combo.jsSourceFiles(theme), done);
            });
        }
    }

    gulp.task('eslint:app', (done) => {
        ExecuteEsLintTasks(combo.appJsSourceFiles(), done);
    });

    gulp.task('eslint:all', (done) => {
        Object.keys(themes).map(theme => ExecuteEsLintTasks(combo.jsSourceFiles(theme), done));
        ExecuteEsLintTasks(combo.appJsSourceFiles(), done);
    });
};

module.exports = new EsLintTasks();