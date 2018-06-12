/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     2.0.1
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

'use strict';

let combo = require('./_combo'),
    themes = require('./_themes'),
    themeOptions = {},
    execOptions = {};

for(let name in themes) {
    themeOptions[name] = {
        cmd: combo.collector.bind(combo, name)
    };
}

execOptions = {
    all : {
        cmd: function () {
            let cmdPlus = (/^win/.test(process.platform) == true) ? ' & ' : ' && ',
                command;

            command = Object.keys(themes).map((name, idx) => {
                return combo.collector(name);
            }).join(cmdPlus);

            return 'echo ' + command;
        }
    },
    cache: {
        cmd: 'php bin/magento cache:flush -q'
    }
};

module.exports = Object.assign(themeOptions, execOptions);
