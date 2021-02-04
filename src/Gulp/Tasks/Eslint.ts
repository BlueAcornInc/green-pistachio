import { src, TaskFunction } from "gulp";
import eslint from 'gulp-eslint';
import { promises as fs } from 'fs';
import { join } from 'path';
import debug from 'debug';
import Module from "../../Models/Module";
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";
import { TaskData } from "../JsFileGlobs";
import AbstractJsTask from "./AbstractJsTask";
import { TaskInterface } from "./TaskInterface";
const logger = debug('gpc:gulp:eslint');

export default class Eslint extends AbstractJsTask implements TaskInterface {
    protected THEME_GLOB = '**/source/**/*.js';
    protected MODULE_GLOB = '**/web/**/source/**/*.js';

    getName(source: Theme | Module): string {
        if (source instanceof Theme) {
            return `Eslint<Theme<${source.getData().path}>>`;
        }

        return `Eslint<Module<${source.getName()}>>`;
    }

    getTask(taskData: TaskData): TaskFunction {
        const task: TaskFunction = async (done) => {
            const eslintConfig = await this.getLintConfig(taskData.project);
            src(taskData.sources, {
                allowEmpty: true
            })
                // @ts-ignore
                .pipe(eslint(eslintConfig))
                .pipe(eslint.format())
                .on('error', (error: Error | null) => done(error))
                .on('finish', done)
                .on('done', done);
            done();
        };
        task.displayName = taskData.displayName;

        return task;
    }

    protected async getLintConfig(project: Project) {
        const config: {
            configFile?: string;
            extends?: string[];
            resolvePluginsRelativeTo?: string;
        } = {};
        const basePath = join(__dirname, '..', '..', '..');

        logger(`Loading project .eslintrc`);
        try {
            const eslintrcPath = join(project.getRootDirectory(), '.eslintrc');
            await fs.stat(eslintrcPath);

            config.configFile = eslintrcPath;
        } catch (err) {
            logger(`No project .eslintrc file found, using default`);
            config.configFile = join(basePath, '.eslintrc');
        }

        logger(`Loading magento .eslintrc file`);
        try {
            const magentoEslintPath = join(
                project.getRootDirectory(),
                'dev',
                'tests',
                'static',
                'testsuite',
                'Magento',
                'Test',
                'Js',
                '_files',
                'eslint',
                '.eslintrc-magento'
            );
            await fs.stat(magentoEslintPath);

            config.extends = [
                magentoEslintPath
            ];
        } catch (err) {
            logger(`Can't find magento eslintrc file.`)
        }
        
        config.resolvePluginsRelativeTo = basePath;

        project.hooks.gulp.eslintConfig.call(config);

        return config;
    }
}