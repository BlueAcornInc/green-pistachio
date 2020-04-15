import isInstalled from '../helpers/is-installed';
const log = require('gulplog');
const logEvents = require('gulp-cli/lib/versioned/^4.0.0/log/events');
const logSyncTask = require('gulp-cli/lib/versioned/^4.0.0/log/sync-task');
const toConsole = require('gulp-cli/lib/shared/log/to-console');

export default async (program) => {
    const installed = await isInstalled();
    if (installed) {
        const gulp = require('gulp');
        logEvents(gulp);
        logSyncTask(gulp);
        toConsole(log, {});
        const namedTasks = require('../../gulpfile.babel');

        for (const namedTask of Object.keys(namedTasks)) {
            program
                .command(namedTask)
                .action(() => {
                    gulp.series(namedTasks[namedTask], (done) => done())();
                });
        }
    }
};