import debug from 'debug';
import clean from 'gulp-clean';
import Project from "../../Models/Project";
import { TaskInterface } from "./TaskInterface";
import { parallel, src, TaskFunction } from 'gulp';
import plumber from 'gulp-plumber';
const logger = debug('gpc:gulp:clean');

export default class Clean implements TaskInterface {
    execute(project: Project) {
        const tasks: TaskFunction[] = project.getThemes().map(theme => {
            const cleanTask: TaskFunction = (done) => {
                const paths = project.getThemePubDirectories(theme);
                logger(`Cleaning Theme Paths: ${paths}`)
                src(paths, { allowEmpty: true, read: false })
                    .pipe(plumber())
                    .pipe(
                        clean({
                            force: true,
                            allowEmpty: true
                        })
                    )
                    .on('end', done)
                    .on('finish', done);
            };

            cleanTask.displayName = `clean<${theme.getData().path}>`;

            return cleanTask;
        });

        const task: TaskFunction = (done) => {
            const staticDirectory = project.getStaticDirectory();

            src([
                `${staticDirectory}/_requirejs/**/*`,
                `${staticDirectory}/deployed_version.txt`
            ], { allowEmpty: true, read: false })
                .pipe(plumber())
                .pipe(
                    clean({
                        force: true,
                        allowEmpty: true
                    })
                )
                .on('end', done)
                .on('finish', done);
        };
        task.displayName = 'cleanProject';

        // TODO: Investigate why this locks up.. looks fine to me.
        tasks.push(task);

        return parallel(...tasks);
    }

    watch(project: Project): TaskFunction {
        return this.execute(project);
    }
}