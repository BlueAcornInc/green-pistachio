import debug from 'debug';
import { dest, src, TaskFunction } from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";
import Module from "../../Models/Module";
import { TaskInterface } from "./TaskInterface";
import { TaskData } from '../JsFileGlobs';
import AbstractJsTask from './AbstractJsTask';
const logger = debug('gpc:gulp:babel');

export default class Babel extends AbstractJsTask implements TaskInterface {
    protected THEME_GLOB = '**/source/**/*.js';
    protected MODULE_GLOB = '**/web/**/source/**/*.js';

    getName(source: Theme | Module): string {
        if (source instanceof Theme) {
            return `Babel<Theme<${source.getData().path}>>`;
        }

        return `Babel<Module<${source.getName()}>>`;
    }

    getTask(taskData: TaskData): TaskFunction {
        const task: TaskFunction = (done) => {
            src(taskData.sources, { allowEmpty: true })
                // @ts-ignore
                .pipe(babel(this.getBabelConfig(taskData.project)))
                .pipe(rename((path) => {
                    path.dirname = path.dirname.replace('/source', '');
                }))
                .pipe(dest(taskData.outputDirectory))
                .on('finish', done);
        };
        task.displayName = taskData.displayName;

        return task;
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