/**
 * @package     BlueAcorn/GreenPistachio
 * @version     4.0.0
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @copyright   Copyright © Blue Acorn iCi. All rights reserved.
 */

import path from 'path';
import chalk from 'chalk';
import settings from './settings';
import activeThemes from './activeThemes';
const themes = require(`${process.cwd()}/gulp-config`);

function rootPath() {
    return process.cwd();
}

function appCodePath() {
    return path.join(rootPath(), settings.appDir, settings.codeDir);
}

function autoPath(theme, folder, locale) {
    return path.join(folder, theme.appPath, theme.themePath, locale);
}

function autoPathAssets(theme, locale) {
    return autoPath(theme, settings.pub, locale);
}

function autoPathThemes(theme) {
    return path.join(rootPath(), settings.appDir, settings.frontend, theme.themePath);
}

function cleanPaths(theme) {
    const themePaths = [];

    themes.forEach((themeConfig) => {
        if (themeConfig.gulp) {
            themeConfig.locales.forEach((locale) => {
                themePaths.push(`${autoPath(themeConfig, settings.pub, locale)}`);
            });
        }
    });

    return [
        ...themePaths,
        `${settings.tmpPreprocessed}`
    ];
}

function varPaths() {
    const cachePaths = [
        'cache',
        'generation',
        'log',
        'maps',
        'page_cache',
        'tmp',
        'view',
        'view_preprocessed'
    ].map((cachePath) => `${settings.tmp}/${cachePath}/**/*`);

    cachePaths.push(`${settings.tmpPreprocessed}/**/*`);
    cachePaths.push(`${settings.deployedVersion}`);

    return cachePaths;
}

function execMessages(task, stdout, stderror) {
    if (stdout) {
        console.log(chalk.green(`\nResults of Task ${task}:\n\n${stdout}`));
    }

    if (stderror) {
        console.log(chalk.red(`\n${task} ERROR:\n\n${stderror}`));
    }
}

function lessFiles(theme) {
    const assetPaths = theme.locales.map((locale) => autoPathAssets(theme, locale));
    let files = [];

    if (theme.stylesheets.length) {
        assetPaths.forEach((assetPath) => {
            files = [...files, ...theme.stylesheets.map((stylesheet) => `${assetPath}/${stylesheet.replace('::', '/')}.less`)];
        });
    }

    return files;
}

function lessWatchFiles() {
    let files = [`${appCodePath()}/**/frontend/**/*.less`];

    activeThemes.forEach((theme) => {
        files = [...files, `${autoPathThemes(theme)}/**/*.less`];
    });

    return files;
}

function getThemePath(theme, folder) {
    return `${autoPathThemes(theme)}${folder}`;
}

function themeCssPath(theme) {
    return getThemePath(theme, '/web/css/source/');
}

function imageminSrc(theme) {
    return getThemePath(theme, '/web/src/');
}

function imageWatchSrcFiles() {
    return [...activeThemes.map((theme) => imageminSrc(theme))];
}

function spriteSourceFiles(theme) {
    return getThemePath(theme, '/web/spritesrc/');
}

function svgSpriteFiles() {
    return [...activeThemes.map((theme) => `${spriteSourceFiles(theme)}**/*.svg`)];
}

function pngSpriteFiles() {
    return [...activeThemes.map((theme) => `${spriteSourceFiles(theme)}**/*.png`)];
}

function autoPathImages(theme) {
    return getThemePath(theme, '/web/images/');
}

function jsSourceFiles(theme) {
    return getThemePath(theme, settings.jsThemeGlob);
}

function jsWatchFiles(theme) {
    return activeThemes.map((theme) => jsSourceFiles(theme));
}

function appJsSourceFiles() {
    return `${appCodePath()}${settings.jsThemeGlob}`;
}

function appJsWatchFiles() {
    return appJsSourceFiles();
}

export {
    autoPath,
    cleanPaths,
    varPaths,
    execMessages,
    lessFiles,
    lessWatchFiles,
    themeCssPath,
    autoPathThemes,
    imageminSrc,
    imageWatchSrcFiles,
    svgSpriteFiles,
    pngSpriteFiles,
    spriteSourceFiles,
    autoPathImages,
    jsSourceFiles,
    jsWatchFiles,
    appCodePath,
    appJsSourceFiles,
    appJsWatchFiles
};
