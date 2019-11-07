/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.1
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <code@blueacorn.com>
 * @copyright   Copyright © 2019, All Rights Reserved.
 */

'use strict';

module.exports = {
    admin: {
        gulp: false,
        appPath: 'adminhtml',
        themePath: 'Magento/backend',
        locale: 'en_US',
        locales: ['en_US'],
        stylesheets: [
            'css/styles',
        ]
    },
    site: {
        gulp: true,
        appPath: 'frontend',
        themePath: 'BlueAcorn/site',
        dev_url: 'm2.test',
        locale: 'en_US',
        locales: ['en_US'],
        stylesheets: [
            'css/styles-m',
            'css/styles-l',
            'css/grid'
        ]
    }
};
