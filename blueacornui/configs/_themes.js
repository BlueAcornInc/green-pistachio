/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     2.0.1
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

'use strict';

/**
 * Contains Configuration information for all themes within your
 * build.
 * @type Object
 */
const themes = {
    blank: {
        grunt: false,
        appPath: 'frontend',
        themePath: 'Magento/blank',
        locale: 'en_US',
        stylesheets: [
            'css/styles-m',
            'css/styles-l',
            'css/email',
            'css/email-inline'
        ],
        stylesheetsSourceLanguage: 'less',
        javascript: [],
        bowerFallback: [],
        themeFallback: []
    },
    luma: {
        grunt: false,
        appPath: 'frontend',
        themePath: 'Magento/luma',
        locale: 'en_US',
        stylesheets: [
            'css/styles-m',
            'css/styles-l'
        ],
        stylesheetsSourceLanguage: 'less',
        javascript: [],
        bowerFallback: [],
        themeFallback: []
    },
    backend: {
        grunt: false,
        appPath: 'adminhtml',
        themePath: 'Magento/backend',
        locale: 'en_US',
        stylesheets: [
            'css/styles-old',
            'css/styles'
        ],
        stylesheetsSourceLanguage: 'less',
        javascript: [],
        bowerFallback: [],
        themeFallback: []
    },
    site: {
        grunt: true,
        appPath: 'frontend',
        themePath: 'BlueAcorn/site',
        dev_url: 'm2.test',
        locale: 'en_US',
        stylesheets: [
            'css/styles-m',
            'css/styles-l'
        ],
        stylesheetsSourceLanguage: 'less',
        javascript: [
            {'BlueAcorn_GreenPistachio': 'blueacorn'}
        ],
        bowerFallback: [],
        themeFallback: ['blank']
    }
};

module.exports = themes;
