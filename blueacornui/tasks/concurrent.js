/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.0
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
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