import debug from 'debug';
import { spawn } from 'child_process';
import { TaskInterface } from "./TaskInterface";
import { series, TaskFunction } from 'gulp';
const logger = debug('gpc:gulp:cache');
import taskName from "./Decorators/TaskNameDecorator";

@taskName("cache")
export class Cache implements TaskInterface {
    execute() {
        logger(`
            Starting Mage 2 Cache Clean
            https://github.com/mage2tv/magento-cache-clean
            Special Thanks to Vinai Kopp & https://www.mage2.tv
        `);

        const cacheClean = spawn('vendor/bin/cache-clean.js', ['--watch']);

        cacheClean.stdout.on('data', (data) => {
            logger(`Magento Cache Clean: ${data}`);
        });

        cacheClean.stderr.on('data', (data) => {
            logger(`Magento Cache Clean: ${data}`);
        });

        cacheClean.on('close', (code) => {
            logger(`Magento Cache Clean exited with code: ${code}`);
        });

        return series((done) => done());
    }

    watch(): TaskFunction {
        return this.execute();
    }
}
