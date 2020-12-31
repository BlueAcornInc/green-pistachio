import { promises as fs } from 'fs';
import { join } from 'path';
import { warn } from '../helpers/reporter';

let errorMessageEmitted = false;

const TS_FILES_TO_GENERATE = [
    {
        path: join(process.cwd(), '.babelrc.js'),
        content: `/**
* @package     BlueAcorn/GreenPistachio
* @author      Blue Acorn iCi. <code@blueacorn.com>
* @copyright   Copyright © Blue Acorn iCi. All Rights Reserved.
*/

/**
* This babel config is inspired by the core config in vendor/magento/module-page-builder, we want similar logic, applied
* across multiple modules
* @type {{}}
*/
const { resolve } = require('path');
const commonPath = resolve(__dirname, 'vendor', 'magento', 'module-page-builder', 'view', 'adminhtml', 'web', 'ts', 'babel');
/**
 * Add modules here, without them being defined, you may have issues importing relative file paths with typescript
 */
const modules = [
    {
        path: 'vendor/magento/module-page-builder/view/adminhtml/web/ts/',
        prefix: 'Magento_PageBuilder'
    },
];

module.exports = {
    passPerPreset: true,
    presets: [
        {
            plugins: [
                ['@babel/plugin-proposal-class-properties', {
                    loose: true
                }],
                '@babel/plugin-transform-modules-amd',
                resolve(commonPath, 'plugin-amd-to-magento-amd')
            ]
        },
        [
            '@babel/preset-env',
            {
                loose: true,
                targets: {
                    browsers: ['last 2 versions', 'ie >= 11']
                },
                modules: 'amd'
            }
        ]
    ],
    plugins: [
        '@babel/plugin-transform-typescript',
        ...(
            modules.map(pageBuilderModule => ([
                resolve(commonPath, 'plugin-resolve-magento-imports'),
                pageBuilderModule,
                pageBuilderModule.prefix
            ]))
        ),
        ['@comandeer/babel-plugin-banner', {
            'banner': "/*eslint-disable */\n/* jscs:disable */",
        }],
        '@babel/plugin-syntax-object-rest-spread'
    ],
    ignore: [
        '/**/*.d.ts',
        '/**/*.types.ts',
    ]
};
`
    },
    {
        path: join(process.cwd(), 'tsconfig.json'),
        content: `{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "Magento_PageBuilder/*": ["vendor/magento/module-page-builder/view/adminhtml/web/ts/*"],
        },
        "strictNullChecks": false,
        "module": "esnext",
        "target": "es2015",
        "allowJs": true,
        "noImplicitAny": true,
        "pretty": true,
        "allowSyntheticDefaultImports": true,
        "lib": [
            "es2015",
            "es2015.iterable",
            "es2015.promise",
            "dom",
            "es7"
        ],
        "types": [
            "jquery",
            "jqueryui",
            "knockout",
            "magento2",
            "object-path",
            "requirejs",
            "slick-carousel",
            "tinycolor",
            "tinymce",
            "underscore"
        ]
    },
    "include": [
        "./**/*.d.ts",
        "./**/*.ts"
    ],
    "exclude": [
        "page-builder-types",
        "node_modules",
        "**/*.spec.ts",
        "**/*.types.ts"
    ]
}
`
    }
];

/**
 * Returns true if project is configured properly for typescript support
 */
export async function checkTypescriptConfigurationState() {
    for (const generateFile of TS_FILES_TO_GENERATE) {
        const { path } = generateFile;

        try {
            await fs.stat(path);
        } catch (err) {
            if (!errorMessageEmitted) {
                warn(`${path} does not exist, run \`gpc configure-typescript\` to populate proper config`);
                warn(`without ${path}, typescript will not work properly`);
                return false;
            }
        }
    }
    
    try {
        await fs.stat(join(process.cwd(), '.babelrc'));

        warn(`Both .babelrc and .babelrc.js, please delete .babelrc for typescript support`)

        return false;
    } catch (err) {
        return true;
    }
}

export async function createTypescriptConfigFiles() {
    for (const generateFile of TS_FILES_TO_GENERATE) {
        const { path, content } = generateFile;

        await fs.writeFile(path, content);
    }
}
