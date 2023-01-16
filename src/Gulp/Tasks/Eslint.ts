import { src, TaskFunction } from "gulp";
import eslint from 'gulp-eslint-new';
import { promises as fs } from 'fs';
import { join } from 'path';
import debug from 'debug';
import Project from "../../Models/Project";
import AbstractJsTask from "./AbstractJsTask";
import { TaskInterface } from "./TaskInterface";
const logger = debug('gpc:gulp:eslint');
import taskName from "./Decorators/TaskNameDecorator";

const fileExists = async (path: string) => !!(await fs.stat(path).catch(e => false));

@taskName("eslint")
export default class Eslint extends AbstractJsTask implements TaskInterface {
    protected THEME_GLOB = '**/source/**/*.js';
    protected MODULE_GLOB = '**/web/**/source/**/*.js';
    protected TASK_NAME = 'Eslint';

    execute(project: Project): TaskFunction {
        if (!process.env.BABEL_ENV) {
            process.env.BABEL_ENV = 'development';
        }

        const taskData = this.getTaskData(project);

        return async (done) => {
            const eslintConfig = await this.getLintConfig(project);
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
    }

    getTask(project: Project, gulpStream: NodeJS.ReadWriteStream): NodeJS.ReadWriteStream {
        return gulpStream;
    }

    protected async getLintConfig(project: Project) {
        const config: {
            configFile?: string;
            extends?: string[];
            resolvePluginsRelativeTo?: string;
            rulePaths?: string[];
        } = {};
        const basePath = join(__dirname, '..', '..', '..');

        logger(`Loading project .eslintrc`);
        const eslintrcPath = join(project.getRootDirectory(), '.eslintrc');
        if (await fileExists(eslintrcPath)) {
            config.configFile = eslintrcPath;
        } else {
            logger(`No project .eslintrc file found, using default`);
            config.configFile = join(basePath, '.eslintrc');
        }

        logger(`Loading magento .eslintrc file`);
        const magentoEslintPath = join(
            project.getRootDirectory(),
            'vendor',
            'magento',
            'magento-coding-standard',
            'eslint',
            '.eslintrc',
        );
        if (await fileExists(magentoEslintPath)) {
            config.extends = [
                magentoEslintPath
            ];

            const rulePath = join(
                project.getRootDirectory(),
                'vendor',
                'magento',
                'magento-coding-standard',
                'eslint',
                'rules'
            );
            config.rulePaths = [
                rulePath
            ];
        } else {
            const legacyMagentoEslintPath = join(
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
            if (await fileExists(legacyMagentoEslintPath)) {
                config.extends = [
                    legacyMagentoEslintPath
                ];
            } else {
                logger(`Can't find magento eslintrc file.`)
            }
        }

        config.resolvePluginsRelativeTo = basePath;

        project.hooks.gulp.eslintConfig.call(config);

        return config;
    }
}
