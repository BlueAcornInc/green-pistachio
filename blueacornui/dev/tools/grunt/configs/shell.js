/**
* @package     BlueAcorn/GreenPistachio
* @version     4.5.0
* @author      Blue Acorn, Inc. <code@blueacorn.com>
* @copyright   Copyright © 2016 Blue Acorn, Inc.
*/

'use strict';

var path = require('./path');

module.exports = {
    cache: {
        command: [
            'cd <%=path.webroot%>',
            'rm -rf var/cache var/generation var/page_cache var/view_preprocessed'
        ].join('&&')
    }
};
