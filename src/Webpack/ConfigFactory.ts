import { Configuration, RuleSetRule, webpack, HotModuleReplacementPlugin } from "webpack";
import debug from 'debug';
import { promises as fs } from 'fs';
import { join } from 'path';
import Project from "../Models/Project";
import Theme from "../Models/Theme";
import EntryResolver from "./EntryResolver";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import VirtualModulesPlugin from 'webpack-virtual-modules';
import MagentoRequireJsManifestPlugin from "./Plugin/MagentoRequireJsManifestPlugin";
import MagentoThemeFallbackResolverPlugin from "./Plugin/MagentoThemeFallbackResolverPlugin";
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
const logger = debug('gpc:webpack:configFactory');

const webpackDevClientEntry = require.resolve('react-dev-utils/webpackHotDevClient');
const reactRefreshOverlayEntry = require.resolve('react-dev-utils/refreshOverlayInterop');

type PathData = {
    chunk: {
        runtime: string;
    }
};

type CommonConfigPayload = {
    config: Partial<Configuration>;
    babelLoader: RuleSetRule;
    cssLoader: RuleSetRule;
    publicPathLoader: RuleSetRule;
};

export default class WebpackConfigFactory {
    private entryResolver: EntryResolver;
    private miniCssExtractPlugin!: MiniCssExtractPlugin;

    constructor() {
        this.entryResolver = new EntryResolver();
    }
    
    public async getConfig(project: Project, theme?: Theme): Promise<Configuration[]> {
        const themes = theme ? [theme] : project.getThemes();
        let configs: Configuration[] = [];

        const allConfigurations = await Promise.all(themes.map(theme => this.getConfigForTheme(project, theme)));
        for (const configuration of allConfigurations) {
            configs = configs.concat(configuration);
        };

        const moduleConfig = await this.getConfigForModules(project);
        configs.push(moduleConfig);

        // @ts-ignore
        return configs;
    }

    /**
     * There can be only one
     * 
     * @returns MiniCssExtractPlugin
     */
    private getMiniExtractTextPlugin(): MiniCssExtractPlugin {
        if (!this.miniCssExtractPlugin) {
            this.miniCssExtractPlugin = new MiniCssExtractPlugin();
        }

        return this.miniCssExtractPlugin;
    }

    private async getCommonConfig(project: Project): Promise<CommonConfigPayload> {
        let tsConfigPath = join(
            project.getRootDirectory(),
            'tsconfig.json'
        );
        let mode: 'production' | 'development' = project.isWebpackDevelopmentMode() ? 'development' : 'production';

        if (!process.env.NODE_ENV) {
            process.env.NODE_ENV = mode;
        }

        try {
            await fs.stat(tsConfigPath);
        } catch (err) {
            tsConfigPath = join(
                __dirname,
                '..',
                '..',
                'green-pistachio.tsconfig.json'
            );
            logger(`No Project tsconfig.json file, using base file.`);
        }

        const babelLoader = {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: ([] as string[])
                .concat(
                    (project.getModules().map(module => module.getSourceDirectory()) as string[])
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
                    ...(mode === 'development' && project.experiments.webpack.hmr ? [
                        require.resolve('react-refresh/babel')
                    ] : [])
                ],
                cacheDirectory: true,
                cacheCompression: false,
                compact: true
            }
        };

        const cssLoader = {
            test: /\.css$/,
            include: ([] as string[])
                .concat(
                    (project.getModules().map(module => module.getSourceDirectory()) as string[])
                ),
            use: [
                mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                },
            ],
        };

        const publicPathLoader = {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: ([] as string[]),
            loader: require.resolve('imports-loader'),
            options: {
                imports: [
                    'side-effects @blueacornici/green-pistachio/webpack-public-path'
                ]
            }
        };

        const config: Partial<Configuration> = {
            mode,
            context: project.getRootDirectory(),
            output: {
                path: project.getRootDirectory(),
                publicPath: '',
                filename: '[name].js',
                libraryTarget: 'amd'
            },
            module: {
                rules: [
                    babelLoader,
                    cssLoader,
                    publicPathLoader
                ]
            },
            ...((mode === 'development') ? 
                {
                    target: 'web'
                } : {}),
            plugins: [
                new ForkTsCheckerWebpackPlugin({
                    typescript: {
                        // Generated file containing path references
                        configFile: tsConfigPath
                    }
                }),
                new VirtualModulesPlugin({
                    'node_modules/@blueacornici/green-pistachio/webpack-public-path.js': '__webpack_public_path__ = `${global.requirejs.s.contexts._.config.baseUrl}/bundle/`;'
                }),
                ...(mode === 'development' ? [
                    this.getMiniExtractTextPlugin()
                ] : []),
                ...(mode === 'development' && project.experiments.webpack.hmr ? [
                    new HotModuleReplacementPlugin(),
                    new ReactRefreshWebpackPlugin({
                        overlay: false
                    })
                ] : [])
            ],
            devtool: mode === 'development' ? 'inline-source-map' : false,
            resolve: {
                extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
            }
        };

        return {
            config,
            babelLoader,
            cssLoader,
            publicPathLoader
        };
    }

    private async getConfigForModules(project: Project): Promise<Configuration> {
        const {
            config,
        } = await this.getCommonConfig(project);
        const entryData = await this.entryResolver.getEntriesForModules(project);
        const entries: Record<string, string> = {};

        for (const entry of entryData) {
            entries[entry.destinationPath] = entry.sourcePath;
        }

        const moduleConfig = {
            ...config,
            entry: entries,
            context: project.getRootDirectory(),
            output: {
                ...config.output,
                path: project.getRootDirectory()
            }
        };

        project.hooks.webpack.config.call(moduleConfig);

        logger(`Built Config: ${JSON.stringify(moduleConfig)}`);

        return moduleConfig;
    }

    private async getConfigForTheme(project: Project, theme: Theme): Promise<Configuration[]> {
        const {
            config: commonConfig,
            babelLoader,
            cssLoader,
            publicPathLoader
        } = await this.getCommonConfig(project);
        const entries = await this.entryResolver.getEntriesForTheme(project, theme);
        const allEntries: Record<string, string> = {};
        // const virtualModules: Record<string, string> = {};

        for (const entry of entries) {
            allEntries[entry.destinationPath] = entry.sourcePath;
        }

        // for (const entry of virtualEntries) {
        //     allEntries[entry.destinationPath] = entry.sourcePath;
        //     virtualModules[entry.sourcePath] = entry.content;
        // }

        babelLoader.include = (babelLoader.include as string[] || []).concat(theme.getSourceDirectory());
        cssLoader.include = (cssLoader.include as string [] || []).concat(theme.getSourceDirectory());
        publicPathLoader.include = (publicPathLoader.include as string[] || []).concat(
            Object.values(allEntries).map(entry => join(
                theme.getSourceDirectory(),
                entry
            ))
        );

        const config: Configuration[] = [];

        for (const pubDirectory of project.getWebpackPubDirectories(theme)) {
            const localeConfig: Configuration = {
                ...commonConfig,
                entry: allEntries,
                context: theme.getSourceDirectory(),
                output: {
                    ...commonConfig.output,
                    // path: join(
                    //     theme.getSourceDirectory(),
                    //     'web',
                    //     'bundle'
                    // ),
                    path: join(
                        pubDirectory,
                        'bundle',
                    ),
                    publicPath: `${join(
                        pubDirectory,
                        'bundle',
                    )}/`
                },
                plugins: [
                    ...(commonConfig.plugins || []),
                    new MagentoRequireJsManifestPlugin(project, theme, entries),
                    // new VirtualModulesPlugin(virtualModules)
                ],
                resolve: {
                    ...(commonConfig.resolve || {}),
                    plugins: [
                        ...(commonConfig.resolve && commonConfig.resolve.plugins || []),
                        new MagentoThemeFallbackResolverPlugin(project, theme)
                    ]
                },
                optimization: {
                    splitChunks: {
                        cacheGroups: {
                            vendors: {
                                test: /[\\/]node_modules[\\/]/,
                                name: 'vendors',
                                chunks: 'all'
                            },
                            styles: {
                                test: /\.css$/,
                                name: 'styles',
                                chunks: 'all',
                                enforce: true
                            },
                            commons: {
                                chunks: 'all',
                                name: 'commons',
                                minChunks: 2,
                                reuseExistingChunk: true,
                                enforce: true
                            }
                        }
                    }
                },
            };
    
            project.hooks.webpack.config.call(localeConfig);
    
            logger(`Built Config: ${JSON.stringify(localeConfig)}`);

            config.push(localeConfig);
        }

        return config;
    }
}