/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */

'use strict';

/**
 * Define paths.
 */

var webroot = '../webroot/';

module.exports = {
    binMage: webroot + 'bin/magento',
    pub: webroot + 'pub/static/',
    code: webroot + 'app/code/',
    design: webroot + 'app/design/',
    tmpLess: webroot + 'var/view_preprocessed/less/',
    tmpSource: webroot + 'var/view_preprocessed/source/',
    tmp: webroot + 'var',
    css: {
        setup: webroot + 'setup/pub/styles',
        updater: webroot + '../magento2-updater/pub/css'
    },
    less: {
        setup: webroot + 'app/design/adminhtml/Magento/backend/web/app/setup/styles/less',
        updater: webroot + 'app/design/adminhtml/Magento/backend/web/app/updater/styles/less'
    },
    uglify: {
        legacy: webroot + 'lib/web/legacy-build.min.js'
    },
    doc: webroot + 'lib/web/css/docs',
    spec: webroot + 'dev/tests/js/spec',
    static: {
        dir: webroot + 'dev/tests/static/testsuite/Magento/Test/Js/_files',
        whitelist: webroot + 'dev/tests/static/testsuite/Magento/Test/Js/_files/whitelist/',
        blacklist: webroot + 'dev/tests/static/testsuite/Magento/Test/Js/_files/blacklist/',
        tmp: webroot + 'validation-files.txt'
    },
    webroot: '../webroot/'
};
