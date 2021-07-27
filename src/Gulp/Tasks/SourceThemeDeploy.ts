import debug from 'debug';
import { TaskInterface } from "./TaskInterface";
import { series, TaskFunction } from 'gulp';
import Project from '../../Models/Project';
import CommandRunner from '../../CommandRunner';
const logger = debug('gpc:gulp:sourceThemeDeploy');

export default class SourceThemeDeploy implements TaskInterface {
    execute(project: Project): TaskFunction {
        const cmdPlus = /^win/.test(process.platform) ? ' & ' : ' && ';

        const commandArray = [];

        for (const theme of project.getThemes()) {
            for (const locale of theme.getLocales()) {
                commandArray.push(`php -d memory_limit=-1 bin/magento dev:source-theme:deploy ${theme.getStyleSheets().map(stylesheet => stylesheet.replace('.less', '')).join(' ')} --type=less --locale=${locale} --area=${theme.getData().area} --theme=${theme.getData().path}`);
            }
        }

        const command = commandArray.join(cmdPlus);
        const commandRunner = new CommandRunner();

        const task: TaskFunction = async (done) => {
            logger(`Starting Source Theme Deploy: ${command}`);

            try {
                const { stdout } = await commandRunner.execute(command);

                logger(`Source Theme Deploy Completed: ${stdout}`);
            } catch (err) {
                logger(`Error deploying source theme: ${err}`);
            }

            done();
        };

        task.displayName = 'sourceThemeDeploy';

        return series(task);
    }

    watch(project: Project) {
        return this.execute(project);
    }
}