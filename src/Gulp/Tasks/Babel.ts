import babel from 'gulp-babel';
import rename from 'gulp-rename';
import Project from "../../Models/Project";
import { TaskInterface } from "./TaskInterface";
import AbstractJsTask from './AbstractJsTask';
import taskName from "./Decorators/TaskNameDecorator";

@taskName("babel")
export default class Babel extends AbstractJsTask implements TaskInterface {
    protected THEME_GLOB = '**/source/**/*.js';
    protected MODULE_GLOB = '**/web/**/source/**/*.js';
    protected TASK_NAME = 'Babel';

    getTask(project: Project, gulpStream: NodeJS.ReadWriteStream): NodeJS.ReadWriteStream {
        return gulpStream
            // @ts-ignore
            .pipe(babel(this.getBabelConfig(project)))
            .pipe(rename((path) => {
                path.dirname = path.dirname.replace('/source', '');
            }));
    }

    protected getBabelConfig(project: Project) {
        const babelConfig = {
            presets: [
                ["babel-preset-react-app", {
                    helpers: false
                }]
            ],
            plugins: [
                // doesn't work as expected, might not be psosible
                // "@babel/plugin-transform-modules-amd"
            ],
            babelrc: false,
            configFile: false
        };
        project.hooks.gulp.babelConfig.call(babelConfig);

        return babelConfig;
    }
}
