/**
 * @package     BlueAcorn/GreenPistachio
 * @version     4.0.0
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @copyright   Copyright © Blue Acorn iCi. All rights reserved.
 */

import chalk from 'chalk';
import { spawn } from 'child_process';
import { execMessages } from '../utils/combo';

export default function watchCache(done) {
    const command = 'vendor/bin/cache-clean.js';

    console.log(chalk.blue(`
        Starting Mage 2 Cache Clean
        https://github.com/mage2tv/magento-cache-clean
        Special Thanks to Vinai Kopp & https://www.mage2.tv
    `));

    const cacheClean = spawn('vendor/bin/cache-clean.js', ['--watch']);

    cacheClean.stdout.on('data', (data) => {
        console.log(chalk.blue(`Magento Cache Clean: ${data}`));
    });

    cacheClean.stderr.on('data', (data) => {
        console.log(chalk.red(`Magento Cache CLean: ${data}`));
    });

    cacheClean.on('close', (code) => {
        console.log(chalk.yellow(`Magento Cache Clean exited with code ${code}`));
    });

    done();
}
