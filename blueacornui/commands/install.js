import { promises as fs } from 'fs';
import glob from 'glob';
import isInstalled, { isComposerPackageInstalled } from '../helpers/is-installed';
import { createBaseTheme, installComposerPackage } from '../helpers/install-theme';
import inquirer from 'inquirer';
import { success, info, error } from '../helpers/reporter';

const settingsLookup = (theme) => {
    const files = [];

    if (theme.area === 'frontend') {
        files.push.apply(files, ['css/styles-m', 'css/styles-l']);
    } else {
        files.push('css/styles');
    }

    return {
        name: theme.name,
        gulp: theme.area === 'frontend' ? true : false,
        appPath: theme.area,
        themePath: `${theme.vendor}/${theme.name}`,
        locale: 'en_US',
        locales: ['en_US'],
        stylesheets: files
    };
};

const createConfigFile = async (themes) => {
    const themeConfig = [];

    for (const theme of themes) {
        themeConfig.push(settingsLookup(theme));
    }

    const content = `/**
* @package     BlueAcorn/GreenPistachio2
* @version     4.0.0
* @author      Blue Acorn iCi <code@blueacorn.com>
* @author      Greg Harvell <code@blueacorn.com>
* @author      Michael Bottens <code@blueacorn.com>
* @copyright   Copyright © 2019, All Rights Reserved.
*/

'use strict';

module.exports = ${JSON.stringify(themeConfig, null, 4)};`;
    await fs.writeFile(`${process.cwd()}/gulp-config.js`, content);
};

const collectThemes = async () => {
    const appThemes = glob.sync(`${process.cwd()}/app/design/frontend/*/*/registration.php`);
    const vendorThemes = glob.sync(`${process.cwd()}/vendor/*/theme-*/registration.php`);

    const themeData = await Promise.all(
        appThemes.concat(vendorThemes).map(theme => (async () => {
            const data = await fs.readFile(theme, 'utf8');
            const [, area, vendor, name] = data.match(/['"](frontend|adminhtml)\/(.*?)\/(.*?)['"]/);
            return {
                area,
                name,
                vendor,
                fullName: `${area}/${vendor}/${name}`
            };
        })())
    );

    return themeData;
};

export default async (program) => {
    const installed = await isInstalled();

    program
        .command('install')
        .description('installs green-pistachio build tools')
        .action(async () => {
            if (installed) {
                error('Green Pistachio Build Tools have already been installed. To rerun the installer, delete your project\'s gulp-config.js file.');
            } else {
                info('collecting installed themes');
                let themes = await collectThemes();

                const { should_install_base } = await inquirer
                    .prompt([{
                        type: 'confirm',
                        name: 'should_install_base',
                        message: 'Do you wish to install a base theme now?'
                    }]);

                if (should_install_base) {
                    await createBaseTheme();
                    themes = await collectThemes();
                    success('Base theme successfully installed.');
                }

                const cacheCleanInstalled = await isComposerPackageInstalled('mage2tv/magento-cache-clean');
                if (!cacheCleanInstalled) {
                    info('installing cache clean module');
                    await installComposerPackage('mage2tv/magento-cache-clean', '--dev');
                    success('cache clean installed');
                }

                const { selected_themes } = await inquirer
                    .prompt([{
                        type: 'checkbox',
                        name: 'selected_themes',
                        message: 'Which themes should we generate configurations for?',
                        choices: themes.map(theme => theme.fullName)
                    }])

                await createConfigFile(
                    selected_themes.map(selected_theme => themes.find(theme => theme.fullName === selected_theme))
                );
                success('created config file');
            }
        })


    return program;
};