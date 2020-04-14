import isInstalled from '../helpers/is-installed';

export default async (program) => {
    const installed = await isInstalled();
    if (installed) {
        const gulp = require('gulp');
        const namedTasks = require('../../gulpfile.babel');

        for (const namedTask of Object.keys(namedTasks)) {
            program
                .command(namedTask)
                .action(() => {
                    namedTasks[namedTask]();
                });
        }
        
        // const tasks = gulp.tasks ? Object.keys(gulp.tasks).sort() : gulp.tree().nodes.sort();

        // for (const task of tasks) {
        //     program
        //         .command(task)
        //         .action(() => {
        //             gulp.task(task)();
        //         });
        // }
    }
};