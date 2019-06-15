/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.1
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © Blue Acorn.
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
    'exec:sprites',
    'exec:all',
    gulp.parallel('less:all', 'imagemin:all', 'eslint:all'),
    gulp.parallel('babel:all', 'exec:cache'),
    'watch'
));

gulp.task('noexec', gulp.series(
    'exec:sprites',
    gulp.parallel('less:all', 'imagemin:all', 'eslint:all'),
    gulp.parallel('babel:all', 'exec:cache'),
    'watch'
));