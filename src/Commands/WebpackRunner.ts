import debug from 'debug';
import Project from "../Models/Project";
import Webpack from "../Gulp/Tasks/Webpack";
import { CommandInterface, WebpackCommandOptions, WebpackCommands } from "./CommandInterface";
const logger = debug('gpc:gulp:runner');

export default class WebpackRunner implements CommandInterface {
    private webpack: Webpack;

    constructor() {
        this.webpack = new Webpack();
    }

    public async run(options: WebpackCommandOptions) {
        const { project, _: command } = options;
        const taskMap = {
            [WebpackCommands.WEBPACK]: this.webpackTask,
            [WebpackCommands.WEBPACK_BUILD]: this.webpackBuildTask,
        };
        const webpackTask = taskMap[command];

        webpackTask.call(this, project)(() => {});

        return false;
    }

    private webpackTask(project: Project) {
        return this.webpack.watch(project);
    }

    private webpackBuildTask(project: Project) {
        return this.webpack.execute(project);
    }
}
