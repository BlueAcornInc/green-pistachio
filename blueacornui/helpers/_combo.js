/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.0
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

const path = require('path');
const themes = require('../../gulp-config');
const {
    exec
} = require('child_process');
const chalk = require('chalk');
const settings = require('./_settings');

const combo = {

    rootPath() {
        'use strict';

        return path.join(__dirname, settings.root);
    },

    autoPath(themeName, folder) {
        let theme = themes[themeName];

        return path.join(folder, theme.appPath, theme.themePath, theme.locale);
    },

    autoPathThemes(themeName) {
        let theme = themes[themeName];

        return path.join(this.rootPath(), settings.appDir, settings.frontend, theme.themePath);
    },

    getThemePath(theme, folder) {
        return `${this.autoPathThemes(theme) + folder}`;
    },

    getNodeModulesDir() {
        console.log(settings.nodeModulesPath);
        console.log(__dirname);
        return path.join(__dirname, '../../', settings.nodeModulesPath);
    },

    autoPathAssets(theme) {
        return this.autoPath(theme, settings.pub);
    },

    autoPathImages(theme) {
        return this.getThemePath(theme, '/web/images/');
    },

    autoPathImageSrc(theme) {
        return this.getThemePath(theme, '/web/src/');
    },

    autoPathSpriteSrc(theme) {
        return this.getThemePath(theme, '/web/spritesrc/');
    },

    autoPathIntermediateSvg(theme) {
        return `${this.getPathImageSrc(theme)}intermediate-svg`;
    },

    autoPathThemeJs(theme) {
        return this.getThemePath(theme, '/**/web/js/**/source/');
    },

    autoPathThemeCss(theme) {
        return this.getThemePath(theme, '/web/css/source/');
    },

    autoPathCss(theme) {
        return `${this.autoPathAssets(theme)}/css/`;
    },

    getNodeModulesDir() {
        return path.join(__dirname, '../../', settings.nodeModulesPath);
    },

    appCodePath() {
        return path.join(this.rootPath(), settings.appDir, settings.codeDir);
    },

    cleanPaths(themeName) {
        let cleanPaths = [],
            pubPath = combo.autoPath(themeName, settings.pub),
            tmpLess = combo.autoPath(themeName, settings.tmpLess),
            tmpSource = combo.autoPath(themeName, settings.tmpSource);

        cleanPaths.push(`${settings.tmp}/cache/*`);
        [pubPath, tmpLess, tmpSource].forEach((idx, themePath) => {
            cleanPaths.push(`${themePath}/*`);
        });

        return cleanPaths;
    },

    cleanVarPaths() {
        let varPaths = [];

        [
            'cache',
            'generation',
            'log',
            'maps',
            'page_cache',
            'tmp',
            'view',
            'view_preprocessed'
        ].forEach((idx, cachePath) => {
            varPaths.push(`${settings.tmp}/${cachePath}/**/*`);
        });

        varPaths.push(`${settings.deployedVersion}`);

        return varPaths;
    },

    collector(themeName) {
        let theme = themes[themeName],
            command = `php bin/magento dev:source-theme:deploy ${theme.stylesheets.join(' ')} --type=less --locale=${theme.locale} --area=${theme.appPath} --theme=${theme.themePath}`;

        console.log(command);
        return command;
    },

    /**
     * Returns Less Files for Current Theme
     * @param themeName
     */
    lessFiles(themeName) {
        let theme = themes[themeName],
            assetsPath = this.autoPathAssets(themeName);

        if (theme.stylesheets.length) {
            let lessFiles = theme.stylesheets.map((stylesheet) => {
                return `${assetsPath}/${stylesheet}.less`;
            });

            return lessFiles;
        }
    },

    lessWatchFiles(themeName) {
        let theme = themes[themeName],
            assetsPath = this.autoPathThemes(themeName),
            files = [];

        if (theme.stylesheets.length) {
            files.push(`${assetsPath}/**/*.less`);
        }

        files.push(`${this.appCodePath()}/**/*.less`);

        return files;
    },

    imgWatchFiles(themeName) {
        return `${this.autoPathImageSrc(themeName)}**/*.{png,jpg,gif,jpeg,svg}`;
    },

    execMessages(task, stdout, stderror) {
        if (stdout) {
            console.log(chalk.green('Results of ' + task + ':\n\n' + stdout));
        }

        if (stderror) {
            console.log(chalk.red(task + 'ERROR:\n\n' + stderror));
        }
    },

    execCommands(command, commandName, done) {
        const self = this;

        exec(command, (error, stdout, stderr) => {
            self.execMessages(commandName, stdout, stderr);
            done(error);
        });
    },

    jsSourceFiles(themeName) {
        return this.getThemePath(themeName, settings.jsThemeGlob);
    },

    jsSourceDestination(themeName) {
        return this.getThemePath(themeName, settings.jsThemeGlob.replace('source/', ''));
    },

    templateWatchFiles(themeName) {
        return `${this.autoPathThemes(themeName)}/**/*.{phtml,xml}`;
    },
};

module.exports = combo;