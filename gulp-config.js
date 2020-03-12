/**
 * @package     BlueAcorn/GreenPistachio
 * @version     4.0.0
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @author      Michael Bottens <michael.bottens@blueacorn.com>
 * @copyright   Copyright © Blue Acorn iCi. All rights reserved.
 */

'use strict';

export default [
    {
        name: "admin",
        gulp: false,
        appPath: "adminhtml",
        themePath: "Magento/backend",
        locales: ['en_US'],
        stylesheets: [
            'css/styles'
        ]
    },
    {
        name: "site",
        gulp: true,
        appPath: "frontend",
        themePath: "BlueAcorn/site",
        locales: ['en_US'],
        stylesheets: [
            'css/styles-m',
            'css/styles-l'
        ]
    },
    {
        name: "siteWithGrid",
        gulp: false,
        appPath: "frontend",
        themePath: "BlueAcorn/site",
        locales: ['en_US'],
        stylesheets: [
            'css/styles-m',
            'css/styles-l',
            'BlueAcorn_CmsFramework::css/grid-l',
            'BlueAcorn_CmsFramework::css/grid-m'
        ]
    }
];
