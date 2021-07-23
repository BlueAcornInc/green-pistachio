import { TaskFunction, watch } from "gulp";
import debug from 'debug';
import WebpackDevServer from 'webpack-dev-server';
import { certificateFor } from 'devcert';
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";
import WebpackConfigFactory from "../../Webpack/ConfigFactory";
import GetCompiler from "../../Webpack/GetCompiler";
import { TaskInterface } from "./TaskInterface";
import TsConfigBuilder from "../../Models/Project/TsConfigBuilder";
import { responseInterceptor } from "../../Webpack/DevServerResponseInterceptor";
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
            project.setWebpackDevelopmentMode();
            const config = await this.webpackConfigFactory.getConfig(project, theme);
            const compiler = this.getCompiler.execute(config);

            const {
                proxyUrl,
                devServerUrl,
                devServerPort
            } = project.getWebpackDevServerConfig();

            let frontendDevServerUrl = `https://${devServerUrl}`;

            if (devServerPort !== 80) {
                frontendDevServerUrl += `:${devServerPort}`
            }

            let ssl = await certificateFor(devServerUrl);

            // Store magento cookies and append back with each proxy request
            let cookieData: string[] | null;

            // @ts-ignore
            const server = new WebpackDevServer(compiler, {
                https: {
                    key: ssl.key,
                    cert: ssl.cert
                },
                ...(project.experiments.webpack.hmr ? {
                    hot: true,
                } : {}),
                proxy: {
                    '/': {
                        target: proxyUrl,
                        secure: false,
                        changeOrigin: true,
                        autoRewrite: true,
                        selfHandleResponse: true,
                        onProxyReq: (proxyReq) => {
                            if (cookieData) {
                                proxyReq.setHeader('cookie', cookieData);
                            }
                        },
                        onProxyRes: responseInterceptor(async (buffer, proxyRes, req, res) => {
                            const proxyCookie = proxyRes.headers['set-cookie'];
                            if (proxyCookie) {
                                cookieData = proxyCookie;
                            }

                            if (proxyRes.headers['location']) {
                                res.setHeader(
                                    'location',
                                    proxyRes.headers['location'].replace(proxyUrl, frontendDevServerUrl)
                                );
                            }

                            if ((proxyRes.headers['content-type'] || '').includes('text/html')) {
                                let response =  buffer.toString()
                                    .replace(new RegExp(proxyUrl, 'g'), frontendDevServerUrl)
                                    .replace(
                                        new RegExp(
                                            proxyUrl.replace(/[^a-z0-9,\._]/iug, (a) => 
                                                `\\\\u00${a.charCodeAt(0).toString(16).toUpperCase()}`
                                            ),
                                            'g'
                                        ),
                                        frontendDevServerUrl
                                    )
                                    .replace(
                                        new RegExp(
                                            proxyUrl.replace(/\//g, '\\\\/'),
                                            'g'
                                        ),
                                        frontendDevServerUrl
                                    )

                                return response;
                            }

                            return buffer;
                        })
                    }
                }
            });

            server.listen(devServerPort, devServerUrl, () => {
                logger('dev server started');
            });

            done();
        };
    }
}