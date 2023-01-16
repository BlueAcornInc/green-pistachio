import rename from "gulp-rename";
import babel from "gulp-babel";
import Project from "../../Models/Project";
import AbstractJsTask from "./AbstractJsTask";
import { TaskInterface } from "./TaskInterface";
import babelResolveImports from "../../babel/plugin-resolve-imports";
import debug from 'debug';
import { join } from 'path';
const logger = debug('gpc:gulp:babelTypescript');
import taskName from "./Decorators/TaskNameDecorator";

@taskName("babelTypescript")
export default class BabelTypeScript extends AbstractJsTask implements TaskInterface {
    protected THEME_GLOB = '**/web/ts/**/*.ts';
    protected MODULE_GLOB = '**/web/ts/**/*.ts';
    protected TASK_NAME = 'Babel TypeScript';

    getTask(project: Project, gulpStream: NodeJS.ReadWriteStream): NodeJS.ReadWriteStream {
        return gulpStream
            // @ts-ignore
            .pipe(babel(this.getBabelConfig(project)))
            .pipe(rename((path) => {
                path.dirname = path.dirname.replace('/ts', '');
            }));
    }

    protected getBabelConfig(project: Project): any {
        const magentoPagebuilderPlugins = [];

        try {
            /**
             * Instead of re-inventing the wheel, we will re-use the Magento Pagebuilder babel plugin
             * that transforms ES6 imports into AMD in a way that is friendly with data-mage-init and
             * text/x-magento-init
             */
            const pageBuilderModule = project.getAllModules().find(
                magentoModule => magentoModule.getName() === 'Magento_PageBuilder'
            );

            if (!pageBuilderModule) {
                throw new Error('Pagebuilder module not found.');
            }

            const pluginPath = join(
                pageBuilderModule.getSourceDirectory(),
                'view',
                'adminhtml',
                'web',
                'ts',
                'babel',
                'plugin-amd-to-magento-amd'
            );

            require.resolve(pluginPath);

            magentoPagebuilderPlugins.push(pluginPath);
        } catch (err) {
            logger('Unable to resolve pagebuilder amd plugin.');
        }

        const babelConfig = {
            plugins: [
                "@babel/plugin-transform-modules-amd",
                ...magentoPagebuilderPlugins,
                babelResolveImports(project)
            ],
            configFile: false
        };
        project.hooks.gulp.babelTypeScriptConfig.call(babelConfig);

        return babelConfig;
    }
}
