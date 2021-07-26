import { parallel, series } from "gulp";
import debug from 'debug';
import Project from "../Models/Project";
import Clean from '../Gulp/Tasks/Clean';
import Less from "../Gulp/Tasks/Less";
import ImageMinGulpTask from "../Gulp/Tasks/Imagemin";
import SvgSprite from "../Gulp/Tasks/SvgSprite";
import PngSprite from "../Gulp/Tasks/PngSprite";
import LiveReload from "../Gulp/Tasks/LiveReload";
import { Cache } from "../Gulp/Tasks/Cache";
import Webpack from "../Gulp/Tasks/Webpack";
import SourceThemeDeploy from "../Gulp/Tasks/SourceThemeDeploy";
import Babel from "../Gulp/Tasks/Babel";
import BabelTypeScript from "../Gulp/Tasks/BabelTypeScript";
import Eslint from "../Gulp/Tasks/Eslint";
import { CommandInterface, CommandOptionsInterface } from "./CommandInterface";
const logger = debug('gpc:gulp:runner');

export enum GulpCommands {
    DEFAULT = 'default',
    LINT = 'lint',
    WATCH = 'watch',
    COMPILE = 'compile',
    WEBPACK = 'webpack',
    WEBPACK_BUILD = 'webpack:build',
};

export interface GulpCommandOptions extends CommandOptionsInterface {
    command: GulpCommands;
};

export default class GulpRunner implements CommandInterface {
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

    public async run(options: GulpCommandOptions) {
        const { project, command } = options;
        const taskMap = {
            [GulpCommands.DEFAULT]: this.default,
            [GulpCommands.COMPILE]: this.compile,
            [GulpCommands.LINT]: this.lint,
            [GulpCommands.WATCH]: this.watch,
            [GulpCommands.WEBPACK]: this.webpackTask,
            [GulpCommands.WEBPACK_BUILD]: this.webpackBuildTask,
        };
        const gulpTask = taskMap[command] || this.default;

        gulpTask.call(this, project)(() => {});

        return false;
    }

    private lint(project: Project) {
        return this.eslint.execute(project);
    }

    private webpackTask(project: Project) {
        return this.webpack.watch(project);
    }

    private webpackBuildTask(project: Project) {
        return this.webpack.execute(project);
    }

    private prepareTasks(project: Project) {
        const task = series(
            this.clean.execute(project),
            parallel(
                this.svgSprite.execute(project),
                this.pngSprite.execute(project)
            ),
            parallel(
                this.imageMin.execute(project),
                this.eslint.execute(project)
            ),
            parallel(
                this.babel.execute(project),
                this.tsBabel.execute(project)
            ),
            this.sourceThemeDeploy.execute(project)
        );
        task.displayName = 'prepareTasks';

        return task;
    }

    private compileTasks(project: Project) {
        return parallel(
            this.less.execute(project),
            this.babel.execute(project),
            this.tsBabel.execute(project),
        );
    }

    private watchTasks(project: Project) {
        return parallel(
            this.less.watch(project),
            this.imageMin.watch(project),
            this.svgSprite.watch(project),
            this.pngSprite.watch(project),
            this.liveReload.watch(),
            this.cache.watch(),
            this.babel.watch(project),
            this.tsBabel.watch(project),
            this.eslint.watch(project)
        );
    }
    
    private defaultTasks(project: Project) {
        const task = series(
            this.prepareTasks(project),
            this.compileTasks(project),
            this.watchTasks(project)
        );
        task.displayName = 'defaultTasks';

        return task;
    }

    private compile(project: Project) {
        return series(
            parallel(
                this.svgSprite.execute(project),
                this.pngSprite.execute(project)
            ),
            parallel(
                this.imageMin.execute(project),
                this.less.execute(project),
                this.babel.execute(project),
                this.tsBabel.execute(project),
            ),
        );
    }

    private watch(project: Project) {
        return series(
            this.compileTasks(project),
            this.watchTasks(project)
        );
    }

    private default(project: Project) {
        return this.defaultTasks(project);
    }
}