/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.0
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

const util = require('util');
const combo = require('../helpers/_combo');
const themes = require('../../gulp-config');
const DefaultRegistry = require('undertaker-registry');

function ExecTasks() {
    'use strict';

    DefaultRegistry.call(this);
};

util.inherits(ExecTasks, DefaultRegistry);

ExecTasks.prototype.init = (gulp) => {
    'use strict';

    for (let theme in themes) {
        if (themes.hasOwnProperty(theme)) {
            gulp.task(`exec:${theme}`, (done) => {
                combo.execCommands(combo.collector(theme), `exec:${theme}`, done);
            });
        }
    }

    gulp.task('exec:all', (done) => {
        let cmdPlus = /^win/.test(process.platform) === true ?
            ' & ' :
            ' && ',
            command = Object.keys(themes).map((name) => {
                return combo.collector(name);
            }).join(cmdPlus);

        combo.execCommands(command, 'exec:all', done);
    });

    gulp.task('exec:cache', (done) => {
        combo.execCommands('vendor/bin/cache-clean.js config layout block_html full_page', 'exec:cache', done);
    });

    gulp.task('exec:block', (done) => {
        combo.execCommands('vendor/bin/cache-clean.js block_html full_page', 'exec:block', done);
    });

    gulp.task('exec:xml', (done) => {
        combo.execCommands('vendor/bin/cache-clean.js layout full_page', 'exec:xml', done);
    });

    gulp.task('exec:sprites', (done) => {
        let cmdPlus = /^win/.test(process.platform) === true ? ' & ' : ' && ';
        let command = '';

        Object.keys(themes).forEach((theme, idx) => {
            if(idx > 0) {
                command += cmdPlus;
            }

            command += `gulp svg-sprite:${theme}${cmdPlus}gulp png-sprite:${theme}`;
        });

        combo.execCommands(command, 'exec:sprites', done);
    });
};

module.exports = new ExecTasks();