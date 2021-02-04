import { Configuration } from "webpack";
import debug from 'debug';
import { promises as fs } from 'fs';
import { join } from 'path';
import Project from "../Models/Project";
import Theme from "../Models/Theme";
import EntryResolver from "./EntryResolver";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
const logger = debug('gpc:webpack:configFactory');

type PathData = {
    chunk: {
        runtime: string;
    }
};

export default class WebpackConfigFactory {
    private entryResolver: EntryResolver;

    constructor() {
        this.entryResolver = new EntryResolver();
    }
    
    public async getConfig(project: Project, theme?: Theme): Promise<Configuration> {
        const themes = theme ? [theme] : project.getThemes();
        const entries = await this.entryResolver.resolve(project, theme);
        let mode: 'production' | 'development' = 'production';

        if (process.env.DEVELOPMENT) {
            mode = 'development';
        }

        let localTsConfigExists = false;

        try {
            await fs.stat(
                join(
                    project.getRootDirectory(),
                    'tsconfig.json'
                )
            );
            localTsConfigExists = true;
        } catch (err) {
            logger(`No Project tsconfig.json file, using base file.`);
        }

        const config: Configuration = {
            entry: () => entries,
            mode,
            context: project.getRootDirectory(),
            output: {
                path: project.getRootDirectory(),
                filename: '[name]',
                libraryTarget: 'amd',
                chunkFilename: (pathData) => {
                    const splitPath = (pathData as PathData).chunk.runtime.split('/');
                    splitPath.splice(-1, 1, '[id].js');

                    logger(`Setting chunk output path to: ${splitPath.join('/')}`);
                    return splitPath.join('/');
                }
            },
            module: {
                rules: [
                    {
                        test: /\.(js|mjs|jsx|ts|tsx)$/,
                        include: ([] as string[])
                            .concat(
                                (project.getModules().map(module => module.getSourceDirectory()) as string[])
                            )
                            .concat(
                                (themes.map(theme => theme.getSourceDirectory()) as string[])
                            ),
                        loader: require.resolve('babel-loader'),
                        options: {
                            customize: require.resolve('babel-preset-react-app/webpack-overrides'),
                            presets: [
                                [
                                    require.resolve('babel-preset-react-app')
                                ]
                            ],
                            babelrc: false,
                            configFile: false,
                            plugins: [
                                // TODO: This is used in CRA, determine what it is for
                                // require.resolve('babel-plugin-named-asset-import')
                            ],
                            cacheDirectory: true,
                            cacheCompression: false,
                            compact: true
                        }
                    }
                ]
            },
            plugins: [
                new ForkTsCheckerWebpackPlugin({
                    typescript: true,
                    ...(localTsConfigExists ? {}: {
                        typescript: {
                            // Generated file containing path references
                            configFile: join(
                                __dirname,
                                '..',
                                '..',
                                'green-pistachio.tsconfig.json'
                            )
                        }
                    })
                })
            ],
            devtool: 'inline-source-map',
            resolve: {
                extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
            }
        };

        project.hooks.webpack.config.call(config);

        logger(`Built Config: ${JSON.stringify(config)}`);

        return config;
    }
}