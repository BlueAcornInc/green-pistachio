import { TaskFunction, watch } from "gulp";
import debug from 'debug';
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";
import WebpackConfigFactory from "../../Webpack/ConfigFactory";
import GetCompiler from "../../Webpack/GetCompiler";
import { TaskInterface } from "./TaskInterface";
import TsConfigBuilder from "../../Models/Project/TsConfigBuilder";
const logger = debug('gpc:gulp:webpack');

export default class Webpack implements TaskInterface {
    private webpackConfigFactory: WebpackConfigFactory;
    private getCompiler: GetCompiler;
    private tsConfigBuilder: TsConfigBuilder;
    private configFileExists: boolean = false;

    constructor() {
        this.webpackConfigFactory = new WebpackConfigFactory();
        this.getCompiler = new GetCompiler();
        this.tsConfigBuilder = new TsConfigBuilder();
    }

    execute(project: Project, theme?: Theme): TaskFunction {
        const webpackTask: TaskFunction = async (done) => {
            if (!this.configFileExists) {
                const exists = await this.tsConfigBuilder.configFileExists();
                
                if (!exists) {
                    await this.tsConfigBuilder.emitConfigFile(project);
                }

                this.configFileExists = true;
            }

            const config = await this.webpackConfigFactory.getConfig(project, theme);
            const compiler = this.getCompiler.execute(config);

            compiler.run((err, stats) => {
                if (err) {
                    logger(err);
                }

                if (stats) {
                    logger(stats.toString({
                        colors: true
                    }));
                }

                done();
            });
        };

        webpackTask.displayName = 'webpack';

        return webpackTask;
    }

    watch(project: Project, theme?: Theme): TaskFunction {
        return async (done) => {
            const config = await this.webpackConfigFactory.getConfig(project, theme);
            const compiler = this.getCompiler.execute(config);

            compiler.watch({}, (err, stats) => {
                if (err) {
                    logger(err);
                    return;
                }

                if (stats) {
                    logger(stats.toString({
                        colors: true
                    }));
                }
            });

            done();
        };
    }
}