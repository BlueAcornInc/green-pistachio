import { join } from 'path';
import { SyncHook } from 'tapable';
import debug from 'debug';
import Module from "./Module";
import Theme, { ThemeData } from "./Theme";
const logger = debug('gpc:project');

type ProjectConstructorArgs = {
    root: string;
    themes: Theme[];
    modules: Module[];
    includePath: string;
};

export default class Project {
    public root: string;
    private themes: Theme[];
    private modules: Module[];
    private includePath: string;

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
            entryGlobs: new SyncHook(["globs"])
        },
        configure: new SyncHook(["project"])
    };

    constructor(config: ProjectConstructorArgs) {
        const { root, themes, modules, includePath } = config;

        this.root = root;
        this.themes = themes;
        this.modules = modules;
        this.includePath = includePath;
    }

    public configure() {
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
    }

    public setIncludePath(includePath: string) {
        this.includePath = includePath;
    }

    public getThemes() {
        return this.themes.filter(theme => 
            theme.getSourceDirectory()
                .includes(join(this.getRootDirectory(), this.includePath))
        );
    }

    public getAllThemes() {
        return this.themes;
    }

    public getModules() {
        return this.modules.filter(module =>
            module.getSourceDirectory()
                .includes(join(this.getRootDirectory(), this.includePath))
        );
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

    public getStaticDirectory() {
        return join(
            this.getRootDirectory(),
            'pub',
            'static'
        );
    }
}