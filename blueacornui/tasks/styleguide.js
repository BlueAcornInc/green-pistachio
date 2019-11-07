/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.1
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2019, All Rights Reserved.
 */

const mustache = require('gulp-mustache');
const util = require('util');
const path = require('path');
// const combo = require('../helpers/_combo');
const themes = require('../../gulp-config');
const DefaultRegistry = require('undertaker-registry');

function StyleGuideTasks() {
    'use strict';

    DefaultRegistry.call(this);
}

util.inherits(StyleGuideTasks, DefaultRegistry);

StyleGuideTasks.prototype.init = (gulp) => {
    'use strict';

    gulp.task('styleguide:build', (done) => {
        let jsonData = path.join(__dirname, '../assets/tmpl/styleguide.json');
        
        let colorsTemplate = path.join(__dirname, '../assets/tmpl/colors.phtml');

        console.log()

        gulp.src(colorsTemplate)
            .pipe(mustache(jsonData,{},{}))
            .pipe(gulp.dest('__dirname, ../../app/design/frontend/BlueAcorn/site/BlueAcorn_GreenPistachio/templates/'));

        done();
    });
};

module.exports = new StyleGuideTasks();