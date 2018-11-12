/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.0
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

const gulp = require('gulp');
const tasks = [
    'babel',
    'clean',
    'exec',
    'eslint',
    'imagemin',
    'less',
    'png-sprite',
    'svg-sprite',
    'styleguide',
    'watch'
];

tasks.forEach((task) => {
    gulp.registry(require(`./blueacornui/tasks/${task}.js`));
});

gulp.task('default', gulp.series(
    gulp.parallel('clean:js', 'clean:all'),
    gulp.parallel('svg-sprite:all', 'png-sprite:all'),
    'exec:all',
    gulp.parallel('less:all', 'imagemin:all', 'eslint:all'),
    gulp.parallel('babel:all', 'exec:cache'),
    'watch'
));

gulp.task('noexec', gulp.series(
    gulp.parallel('svg-sprite:all', 'png-sprite:all'),
    gulp.parallel('less:all', 'imagemin:all', 'eslint:all'),
    gulp.parallel('babel:all', 'exec:cache'),
    'watch'
));