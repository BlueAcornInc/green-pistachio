/**
 * @package     BlueAcorn/GreenPistachio
 * @version     4.0.0
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @author      Michael Bottens <michael.bottens@blueacorn.com>
 * @copyright   Copyright © Blue Acorn iCi. All rights reserved.
 */

import { task } from 'gulp';
import chalk from 'chalk';
import { exec } from 'child_process';
import { execMessages } from '../utils/combo';
import activeThemes from '../utils/activeThemes';

/**
 * Source Theme Deploy
 * @param done
 */
export default function sourceThemeDeploy(done) {
    const cmdPlus = /^win/.test(process.platform) ? ' & ' : ' && ';

    let command = '';
    let count = 0;

    activeThemes.forEach((theme) => {
        theme.locales.forEach((locale) => {
            if (count > 0) {
                command += cmdPlus;
            }

            // eslint-disable-next-line max-len
            command += `php -d memory_limit=1024M bin/magento dev:source-theme:deploy ${theme.stylesheets.join(' ')} --type=less --locale=${locale} --area=${theme.appPath} --theme=${theme.themePath}`;

            count += 1;
        });
    });

    console.log(chalk.yellow(`\nStarting Source Theme Deploy:\n\n${command}\n`));

    exec(command, (error, stdout, stderr) => {
        execMessages('Magento Source Theme Deploy', stdout, stderr);
        done(error);
    });
}

task('sourceThemeDeploy', (done) => sourceThemeDeploy(done));
