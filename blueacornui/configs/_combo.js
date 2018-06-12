/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     2.0.1
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

'use strict';

var fs = require('fs'),
    glob = require('glob'),
    path = require('path'),
    grunt = require('grunt'),
    themes = require('./_themes'),
    vendors = require('./_vendors'),
    settings = require('./_settings');

    // TODO: ADD Modules modules = require('./_modules');

const combo = {

    /**
     * Get the root path of your application (eg. webroot).
     * @return String Path to root application directory.
     */
    rootPath() {
        return path.join(__dirname, settings.gruntRoot);
    },

    autoPath(themeName, folder) {
        let self = this;
        return path.join(
            folder,
            themes[themeName].appPath,
            themes[themeName].themePath,
            themes[themeName].locale
        );
    },

    autoPathAssets(themeName) {
        return this.autoPath(themeName, settings.pub);
    },

    appCodePath() {
        return path.join(
            settings.appDir,
            settings.codeDir
        );
    },

    themesPath(themeName) {
        return path.join(
            settings.appDir,
            settings.frontend,
            themes[themeName].themePath
        );
    },

    autoPathImages(themeName) {
        return this.themesPath(themeName) + '/web/images/';
    },

    autoPathImageSrc(themeName) {
        return this.themesPath(themeName) + '/web/src/';
    },

    autoPathSpriteSrc(themeName) {
        return this.themesPath(themeName) + '/web/spritesrc/';
    },

    autoPathIntermediateSvg(themeName) {
        return this.autoPathImageSrc(themeName) + 'intermediate-svg';
    },

    autoPathThemeJs(themeName) {
        return this.themesPath(themeName) + '/**/web/js/**/source/';
    },

    autoPathThemeCss(themeName) {
        return this.themesPath(themeName) + '/web/css/source/';
    },

    autoPathCss(themeName) {
        return this.autoPathAssets(themeName) + '/css/';
    },

    getNodeModulesDir() {
        return path.join(__dirname, '../../', settings.nodeModulesPath);
    },

    cleanPaths(themeName) {
        let cleanPaths = [],
            pubPath = combo.autoPath(themeName, settings.pub),
            tmpLess = combo.autoPath(themeName, settings.tmpLess),
            tmpSource = combo.autoPath(themeName, settings.tmpSource);

        cleanPaths.push(settings.tmp + '/cache/**/*');
        cleanPaths.push(pubPath + '/**/*');
        cleanPaths.push(tmpLess + '/**/*');
        cleanPaths.push(tmpSource + '/**/*');

        return cleanPaths;
    },

    jsSourceObjectByGlob(paths) {
        let sourcesObject = {};

        grunt.file.expand({
            nonull: true
        }, paths).forEach((file)=> {
            sourcesObject[file.replace('source/','')] = file;
        });

        return sourcesObject;
    },

    jsSourceArrayByGlob(paths) {
        return grunt.file.expand({
            nonull: true
        }, paths);
    },

    jsSourceFiles(themeName) {
        return this.jsSourceObjectByGlob([this.themesPath(themeName) + settings.jsThemeGlob]);
    },

    jsAppCodeBabelSourceFiles() {
        return this.jsSourceObjectByGlob([this.appCodePath() + settings.jsModuleGlob]);
    },

    jsThemeSourceFiles(themeName) {
        return this.jsSourceArrayByGlob([this.themesPath(themeName) + settings.jsThemeGlob]);
    },

    jsAppCodeSourceFiles() {
        return this.jsSourceArrayByGlob([this.appCodePath() + settings.jsModuleGlob]);
    },

    lessFiles(themeName) {
        let currentTheme = themes[themeName],
            assetsPath = this.autoPathAssets(themeName),
            lessStringArray = [],
            cssStringArray = [],
            lessFiles = {};

        if(currentTheme.stylesheets.length) {
            currentTheme.stylesheets.forEach((stylesheet, idx) => {
                cssStringArray[idx] = assetsPath + '/' + stylesheet + '.css';

                lessStringArray[idx] = assetsPath + '/' + stylesheet + '.less';

                lessFiles[cssStringArray[idx]] = lessStringArray[idx];
            });
        }

        return lessFiles;
    },

    watchFiles(themeName, fileType) {
        let currentTheme = themes[themeName],
            assetsPath = this.autoPathAssets(themeName),
            files = [];

        if(currentTheme.stylesheets.length) {
            files.push(assetsPath + '/**/*.' + fileType);
        }
        return files;
    },

    lessWatchFiles(themeName) {
        let currentTheme = themes[themeName],
            assetsPath = this.themesPath(themeName),
            files = [];

        if(currentTheme.stylesheets.length) {
            files.push(assetsPath + '/**/*.less');
        }

        this.lessAppCodeSource().forEach((file)=>{
            files.push(file);
        });

        return files;
    },

    lessAppCodeSource() {
        return grunt.file.expand({
            nonull: true
        }, [this.appCodePath() + settings.lessModuleGlob]);
    },

    cssWatchFiles(themeName) {
        return this.watchFiles(themeName, 'css');
    },

    themeTemplateWatchFiles() {
        let files = [],
            themesPath;

            for(let theme in themes) {
                let currentTheme = themes[theme];
                if(currentTheme.grunt) {
                    themesPath = this.themesPath(theme);
                    files.push(themesPath + '/**/*.phtml');
                    files.push(themesPath + '/**/*.xml');
                }
            }

        return files;
    },

    appCodeWatchFiles() {
        let files = [],
            appPath;

        for(let theme in themes) {
            let currentTheme = themes[theme];
            if(currentTheme.grunt) {
                appPath = this.appCodePath();
                files.push(appPath + '/**/*.php');
                files.push(appPath + '/**/*.phtml');
                files.push(appPath + '/**/*.html');
                files.push(appPath + '/**/*.xml');
            }
        }

        return files;
    },

    imgWatchFiles(themeName) {
        return this.autoPathImageSrc(themeName) + '**/*.{png,jpg,gif,jpeg,svg}';
    },

    pngSpriteWatchFiles(themeName) {
        return this.autoPathSpriteSrc(themeName) + '**/*.png';
    },

    svgSpriteWatchFiles(themeName) {
        return this.autoPathSpriteSrc(themeName) + '**/*.svg';
    },

    getLessPaths(cssFolder, css, lessFolder, less) {
        let paths = {},
            cssPath = cssFolder + css,
            lessPath = lessFolder + less;
            paths[cssPath] = lessPath;

        return paths;
    },

    autoPrefixerFiles(themeName) {
        let cssStringArray = [],
            assetsPath = this.autoPathAssets(themeName),
            currentTheme = themes[themeName];

        if(currentTheme.stylesheets.length) {
            currentTheme.stylesheets.forEach((stylesheet, idx) => {
                cssStringArray.push(assetsPath + '/' + stylesheet + '.css');
            });
        }

        return cssStringArray;
    },

    getLiveReload(themeName) {
        let lr = true;

        if(grunt.option('livereload') && typeof grunt.option('livereload') === 'string') {
            if(themeName !== grunt.option('livereload')) {
                lr = false;
            }
        }

        return lr;
    },

    browserSyncFiles(themeName) {
        return [
            ...this.autoPrefixerFiles(themeName),
            ...this.appCodeWatchFiles(),
            '!' + this.appCodePath() + '/**/source/**/*.js',
            this.appCodePath() + '/**/*.js',
            '!' + this.themesPath(themeName) + '/**/source/**/*.js',
            this.themesPath(themeName) + '/**/*.js'
        ];
    },

    collector(themeName) {
        let currentTheme = themes[themeName],
            command;

        command = 'php bin/magento dev:source-theme:deploy ' +
            currentTheme.stylesheets.join(' ') +
            ' --type=less' +
            ' --locale=' + currentTheme.locale +
            ' --area=' + currentTheme.appPath +
            ' --theme=' + currentTheme.themePath;

        console.log(command);
        return command;
    }
};

module.exports = combo;
