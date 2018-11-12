/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.0
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

const imagemin = require('gulp-imagemin');
const util = require('util');
const combo = require('../helpers/_combo');
const themes = require('../../gulp-config');
const DefaultRegistry = require('undertaker-registry');

function ImageminTasks() {
    'use strict';

    DefaultRegistry.call(this);
}

util.inherits(ImageminTasks, DefaultRegistry);

const imageminOptions = {
    png: {
        optimizationLevel: 7
    }
};

ImageminTasks.prototype.init = (gulp) => {
    'use strict';

    function ExecuteImageminTasks(theme, done) {
        gulp.src(`${combo.autoPathImageSrc(theme)}**/*.{png,jpg,gif,jpeg,svg}`)
            .pipe(imagemin([
                imagemin.gifsicle(),
                imagemin.jpegtran(),
                imagemin.optipng(imageminOptions.png),
                imagemin.svgo()
            ]))
            .pipe(gulp.dest(combo.autoPathImages(theme)))
            .on('end', done);
    }

    for (let theme in themes) {
        if(themes.hasOwnProperty(theme)) {
            gulp.task(`imagemin:${theme}`, (done) => {
                ExecuteImageminTasks(theme, done);
                done();
            });
        }
    }

    gulp.task('imagemin:all', (done) => {
        Object.keys(themes).map(theme => ExecuteImageminTasks(theme, done));
        done();
    });
};

module.exports = new ImageminTasks();