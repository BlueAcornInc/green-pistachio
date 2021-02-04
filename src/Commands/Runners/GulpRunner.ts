import { parallel, series } from "gulp";
import debug from 'debug';
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";
import Clean from '../../Gulp/Tasks/Clean';
import Less from "../../Gulp/Tasks/Less";
import ImageMinGulpTask from "../../Gulp/Tasks/Imagemin";
import SvgSprite from "../../Gulp/Tasks/SvgSprite";
import PngSprite from "../../Gulp/Tasks/PngSprite";
import LiveReload from "../../Gulp/Tasks/LiveReload";
import { Cache } from "../../Gulp/Tasks/Cache";
import Webpack from "../../Gulp/Tasks/Webpack";
import SourceThemeDeploy from "../../Gulp/Tasks/SourceThemeDeploy";
import Babel from "../../Gulp/Tasks/Babel";
import BabelTypeScript from "../../Gulp/Tasks/BabelTypeScript";
import Eslint from "../../Gulp/Tasks/Eslint";
const logger = debug('gpc:gulp:runner');

export default class GulpRunner {
    private clean: Clean;
    private less: Less;
    private imageMin: ImageMinGulpTask;
    private svgSprite: SvgSprite;
    private pngSprite: PngSprite;
    private liveReload: LiveReload;
    private cache: Cache;
    private webpack: Webpack;
    private sourceThemeDeploy: SourceThemeDeploy;
    private babel: Babel;
    private tsBabel: BabelTypeScript;
    private eslint: Eslint;

    constructor() {
        this.clean = new Clean();
        this.less = new Less();
        this.imageMin = new ImageMinGulpTask();
        this.svgSprite = new SvgSprite();
        this.pngSprite = new PngSprite();
        this.liveReload = new LiveReload();
        this.cache = new Cache();
        this.webpack = new Webpack();
        this.sourceThemeDeploy = new SourceThemeDeploy();
        this.babel = new Babel();
        this.tsBabel = new BabelTypeScript();
        this.eslint = new Eslint();

        // Prepare logger
        const gulp = require('gulp');
        require('gulp-cli/lib/versioned/^4.0.0/log/events')(gulp);
        require('gulp-cli/lib/versioned/^4.0.0/log/sync-task')(gulp, {});
        require('gulp-cli/lib/shared/log/to-console')(require('gulplog'), {});
    }

    public prepareTasks(project: Project, theme?: Theme) {
        const task = series(
            this.clean.execute(project, theme),
            parallel(
                this.svgSprite.execute(project, theme),
                this.pngSprite.execute(project, theme)
            ),
            parallel(
                this.imageMin.execute(project, theme),
                this.eslint.execute(project, theme)
            ),
            parallel(
                this.babel.execute(project, theme),
                this.tsBabel.execute(project, theme),
                this.webpack.execute(project, theme)
            ),
            this.sourceThemeDeploy.execute(project, theme)
        );
        task.displayName = 'prepareTasks';

        return task;
    }

    public compileTasks(project: Project, theme?: Theme) {
        return parallel(
            this.less.execute(project, theme),
            this.webpack.execute(project, theme),
            this.babel.execute(project, theme),
            this.tsBabel.execute(project, theme),
        );
    }

    public watchTasks(project: Project, theme?: Theme) {
        return parallel(
            this.less.watch(project, theme),
            this.imageMin.watch(project, theme),
            this.svgSprite.watch(project, theme),
            this.pngSprite.watch(project, theme),
            this.liveReload.watch(),
            this.cache.watch(),
            this.webpack.watch(project, theme),
            this.babel.watch(project, theme),
            this.tsBabel.watch(project, theme),
            this.eslint.watch(project, theme)
        );
    }
    
    public defaultTasks(project: Project, theme?: Theme) {
        const task = series(
            this.prepareTasks(project, theme),
            this.compileTasks(project, theme),
            this.watchTasks(project, theme)
        );
        task.displayName = 'defaultTasks';

        return task;
    }

    public compile(project: Project, theme?: Theme) {
        return series(
            parallel(
                this.svgSprite.execute(project, theme),
                this.pngSprite.execute(project, theme)
            ),
            parallel(
                this.imageMin.execute(project, theme),
                this.less.execute(project, theme),
                this.webpack.execute(project, theme),
                this.babel.execute(project, theme),
                this.tsBabel.execute(project, theme),
            ),
        );
    }

    public watch(project: Project, theme?: Theme) {
        return series(
            this.compileTasks(project, theme),
            this.watchTasks(project, theme)
        );
    }

    public default(project: Project, theme?: Theme) {
        return this.defaultTasks(project, theme);
    }
}