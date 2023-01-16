import {
    src,
    dest,
    parallel,
    watch,
    TaskFunction
} from 'gulp';
import debug from 'debug';
import sourcemaps from 'gulp-sourcemaps';
import less from 'gulp-less';
import livereload from 'gulp-livereload';
import { join } from 'path';
import Project from '../../Models/Project';
import Theme from '../../Models/Theme';
import { TaskInterface } from './TaskInterface';
const logger = debug('gpc:gulp:less');
import taskName from "./Decorators/TaskNameDecorator";

@taskName("less")
export default class Less implements TaskInterface {
    execute(project: Project, theme?: Theme) {
        const themes = theme ? [theme] : project.getThemes();
        let sources: string[] = [];

        for (const theme of themes) {
            for (const publicDirectory of project.getThemePubDirectories(theme)) {
                sources = sources.concat(theme.getStyleSheets().map(stylesheet => join(publicDirectory, stylesheet)));
            }
        }

        const tasks: TaskFunction[] = sources.map(source => {

            const task: TaskFunction = (done) => {
                logger(source);
                src(source)
                    .pipe(sourcemaps.init())
                    .pipe(
                        less()
                            .on('error', (err) => {
                                logger(source);
                                logger(err);
                            })
                    )
                    .pipe(sourcemaps.write('./'))
                    .pipe(
                        dest(
                            source.substring(
                                0,
                                source.lastIndexOf('/')
                            )
                        )
                    )
                    .pipe(livereload())
                    .on('finish', done);
            };

            task.displayName = `less<${source}>`;

            return task;
        });

        if (tasks.length === 0) {
            logger('No Less Tasks Running');
            tasks.push(done => done());
        }

        return parallel(...tasks);
    }

    watch(project: Project, theme?: Theme): TaskFunction {
        return (done) => {
            const themes = theme ? [theme] : project.getThemes();

            watch(
                this.getWatchFiles(project, themes),
                this.execute(project, theme)
            );
        };
    }

    private getWatchFiles(project: Project, themes: Theme[]): string[] {
        return project
            .getModules().map(module => `${module.getSourceDirectory()}/view/**/*.less`)
            .concat(
                themes.map(theme => `${theme.getSourceDirectory()}/**/*.less`)
            );
    }
}
