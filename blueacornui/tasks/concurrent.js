/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.1
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2019, All Rights Reserved.
 */

const util = require('util');
// const combo = require('../helpers/_combo');
// const themes = require('../../gulp-config');
const DefaultRegistry = require('undertaker-registry');

function ConcurrentTasks() {
    'use strict';

    DefaultRegistry.call(this);
}

util.inherits(ConcurrentTasks, DefaultRegistry);

ConcurrentTasks.prototype.init = (gulp) => {
    'use strict';
    // gulp();
};

module.exports = new ConcurrentTasks();