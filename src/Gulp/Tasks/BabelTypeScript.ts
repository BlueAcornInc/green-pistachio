import { dest, src, TaskFunction } from "gulp";
import rename from "gulp-rename";
import babel from "gulp-babel";
import Project from "../../Models/Project";
import { TaskData } from "../JsFileGlobs";
import AbstractJsTask from "./AbstractJsTask";
import { TaskInterface } from "./TaskInterface";
import Theme from "../../Models/Theme";
import Module from "../../Models/Module";
import babelResolveImports from "../../babel/plugin-resolve-imports";

export default class BabelTypeScript extends AbstractJsTask implements TaskInterface {
    protected THEME_GLOB = '**/web/ts/**/*.ts';
    protected MODULE_GLOB = '**/web/ts/**/*.ts';

    getName(source: Theme | Module): string {
        if (source instanceof Theme) {
            return `BabelTS<Theme<${source.getData().path}>>`;
        }

        return `BabelTS<Module<${source.getName()}>>`;
    }

    getTask(taskData: TaskData): TaskFunction {
        const task: TaskFunction = (done) => {
            src(taskData.sources, { allowEmpty: true })
                // @ts-ignore
                .pipe(babel(this.getBabelConfig(taskData.project)))
                .pipe(rename((path) => {
                    path.dirname = path.dirname.replace('/ts', '');
                }))
                .pipe(dest(taskData.outputDirectory))
                .on('finish', done);
        };
        task.displayName = taskData.displayName;

        return task;
    }

    protected getBabelConfig(project: Project): any {
        const babelConfig = {
            presets: [
                ["babel-preset-react-app", {
                    helpers: false
                }]
            ],
            plugins: [
                // doesn't work as expected, might not be psosible
                "@babel/plugin-transform-modules-amd",
                babelResolveImports(project)
            ],
            babelrc: false,
            configFile: false
        };
        project.hooks.gulp.babelTypeScriptConfig.call(babelConfig);

        return babelConfig;
    }
}