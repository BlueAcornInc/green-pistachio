import { join } from 'path';
import { SyncHook } from 'tapable';
import debug from 'debug';
import Module from "./Module";
import Theme, { ThemeData } from "./Theme";
import ConfigLoader from './Project/ConfigLoader';
import { Configuration } from 'webpack';
import WebpackConfigFactory from '../Webpack/ConfigFactory';
const logger = debug('gpc:project');

type ProjectConstructorArgs = {
    root: string;
    themes: Theme[];
    modules: Module[];
    enabledThemes?: string[];
};

type WebpackDevServerConfig = {
    proxyUrl: string;
    devServerUrl: string;
    devServerPort: number;
};

export default class Project {
    public root: string;
    private themes: Theme[];
    private enabledThemes: Theme[];
    private modules: Module[];
    private webpackDevelopmentMode: boolean = false;
    private proxyUrl: string = '';
    private devServerConfig: Partial<WebpackDevServerConfig> = {};

    public hooks = {
        // These hooks allow for modifying various gulp configurations
        gulp: {
            babelConfig: new SyncHook(["config"]),
            babelTypeScriptConfig: new SyncHook(["config"]),
            pngSpriteConfig: new SyncHook(["config"]),
            svgSpriteConfig: new SyncHook(["config"]),
            eslintConfig: new SyncHook(["config"]),
            criticalCssConfig: new SyncHook(["config"]),
        },
        webpack: {
            config: new SyncHook(["config"]),
            entryGlobs: new SyncHook(["globs"]),
            appendConfig: new SyncHook<[Configuration[], WebpackConfigFactory]>(["webpackConfigs", "configFactory"])
        },
        configure: new SyncHook(["project"])
    };

    public experiments = {
        webpack: {
            // Set to true in the the project.configure hook to enable unstable HMR functionality
            hmr: false,
            // Set to true to enable css modules
            cssModules: false,
            // Set to true to emit files to the pub directory instead of the individual theme directories
            emitFilesToPub: false,
        }
    };

    constructor(config: ProjectConstructorArgs) {
        const { root, themes, modules, enabledThemes } = config;

        this.root = root;
        this.themes = themes;
        this.modules = modules;
        this.enabledThemes = enabledThemes
            ? themes.filter(theme => enabledThemes.includes(theme.getData().path))
            : [];
    }

    public configure() {
        if (this.enabledThemes.length > 0) {
            // Enable default themes
            for (const theme of this.enabledThemes) {
                theme.setEnabled(true);
            }
        } else {
            for (const theme of this.themes) {
                if (
                    !theme
                        .getSourceDirectory()
                        .includes(
                            join(
                                this.getRootDirectory(),
                                'vendor'
                            )
                        )
                ) {
                    theme.setEnabled(true);
                    this.enabledThemes.push(theme);
                }
            }
        }

        // Enable default modules
        for (const magentoModule of this.modules) {
            if (
                !magentoModule
                    .getSourceDirectory()
                    .includes(
                        join(
                            this.getRootDirectory(),
                            'vendor'
                        )
                    )
            ) {
                magentoModule.setEnabled(true);
            }
        }

        this.hooks.configure.call(this);
    }

    public configureTheme(themeData: Partial<ThemeData>) {
        if (!themeData.path) {
            logger(`can not configure theme without defined path: ${JSON.stringify(themeData)}`);
            return;
        }

        const theme = this.themes.find(theme => theme.getData().path === themeData.path);

        if (!theme) {
            logger(`can not find theme with path = '${themeData.path}'`);
            return;
        }

        theme.configure(themeData);

        if (themeData.hasOwnProperty('enabled')) {
            theme.setEnabled(themeData.enabled);
        }
    }

    public enableModule(moduleName: string) {
        const magentoModule = this.modules.find(magentoModule => magentoModule.getName() === moduleName);

        if (!magentoModule) {
            logger(`could not find module by name: ${moduleName}`);
            return;
        }

        magentoModule.setEnabled(true);
    }

    public getThemes() {
        return this.enabledThemes.filter(magentoTheme => magentoTheme.getEnabled());
    }

    public getAllThemes() {
        return this.themes;
    }

    public getModules() {
        return this.modules.filter(magentoModule => magentoModule.getEnabled());
    }

    public getAllModules() {
        return this.modules;
    }

    public getRootDirectory() {
        return this.root;
    }

    public getThemePubDirectories(theme: Theme) {
        return theme.getLocales().map(locale => join(
            this.getStaticDirectory(),
            theme.getData().area,
            theme.getData().path,
            locale
        ));
    }

    public getWebpackOutputDirectories(theme: Theme) {
        if (this.isWebpackDevelopmentMode() || this.experiments.webpack.emitFilesToPub) {
            return theme.getLocales().map(locale => join(
                this.getRootDirectory(),
                ...(
                    this.isWebpackDevelopmentMode()
                    ? ['static']
                    : ['pub', 'static']
                ),
                theme.getData().area,
                theme.getData().path,
                locale
            ));
        }

        return [join(theme.getSourceDirectory(), 'web')];
    }

    public getStaticDirectory() {
        return join(
            this.getRootDirectory(),
            'pub',
            'static'
        );
    }

    public isWebpackDevelopmentMode() {
        return this.webpackDevelopmentMode;
    }

    public setWebpackDevelopmentMode() {
        this.webpackDevelopmentMode = true;
    }

    public setProxyUrl(url: string) {
        this.proxyUrl = url;
    }

    public getProxyUrl(): string {
        if (this.proxyUrl.length === 0) {
            if (!debug.enabled('gpc:logger')) {
                debug.enable('gpc:logger');
            }
            logger(`A project URL must be provided in your projects ${ConfigLoader.CONFIG_FILE}`);
            logger(`\n\nExample:
module.exports = project => {
project.hooks.configure.tap("Set Product Url", () => {
    project.setProxyUrl("https://example.test");
});
}
            `);

            throw new Error(`A project URL must be provided in your projects ${ConfigLoader.CONFIG_FILE}`);
        }

        return this.proxyUrl;
    }

    public setWebpackDevServerConfig(config: Partial<WebpackDevServerConfig>) {
        if (config.proxyUrl) {
            this.proxyUrl = config.proxyUrl;
        }

        this.devServerConfig = config;
    }

    public getWebpackDevServerConfig(): WebpackDevServerConfig {
        return {
            proxyUrl: this.getProxyUrl(),
            devServerUrl: 'green-pistachio.test',
            devServerPort: 8080,
            ...(this.devServerConfig || {})
        };
    }
}
