import {
    src,
    dest,
    parallel,
    watch,
    TaskFunction
} from 'gulp';
import debug from 'debug';
import imagemin from 'gulp-imagemin';
import { join } from 'path';
import Project from '../../Models/Project';
import Theme from '../../Models/Theme';
import { TaskInterface } from './TaskInterface';
const logger = debug('gpc:gulp:imageMin');

export default class ImageMinGulpTask implements TaskInterface {
    execute(project: Project, theme?: Theme) {
        const themes = theme ? [theme] : project.getThemes();

        const tasks: TaskFunction[] = themes.map(theme => {
            const task: TaskFunction = (done) => {
                const imageMinPaths = `${this.getImageMinSourceDirectory(theme)}/**/*.{png,jpg,gif,jpeg,svg,jpeg}`;

                logger(`Paths: ${imageMinPaths}`);

                src(imageMinPaths)
                    .pipe(imagemin([
                        imagemin.gifsicle(),
                        imagemin.mozjpeg(),
                        imagemin.optipng({ optimizationLevel: 7 }),
                        imagemin.svgo()
                    ]))
                    .pipe(dest(
                        join(
                            theme.getSourceDirectory(),
                            'web',
                            'images'
                        )
                    ))
                    .on('end', () => done());
            };

            task.displayName = `imageMin<${theme.getData().path}>`;

            return task;
        });

        return parallel(...tasks);
    }

    watch(project: Project, theme?: Theme): TaskFunction {
        return (done) => {
            const themes = theme ? [theme] : project.getThemes();
    
            watch(
                themes.map(theme => this.getImageMinSourceDirectory(theme)),
                this.execute(project, theme)
            );
        };
    }

    private getImageMinSourceDirectory(theme: Theme): string {
        return join(theme.getSourceDirectory(), 'web', 'src')
    }
}