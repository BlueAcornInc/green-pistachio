/**
 * @jest-environment node
 */
import mock from 'mock-fs';
import { join } from 'path';
import Project from '../../Models/Project';
import Theme from '../../Models/Theme';
import BabelTypeScript from './BabelTypeScript';
import { promises as fs } from 'fs';
import Module from '../../Models/Module';

afterEach(() => {
    mock.restore();
});

describe('Gulp: Babel', () => {
    it('should compile typescript', async (done) => {
        mock({
            'node_modules': mock.load(join(__dirname, '..', '..', '..', 'node_modules')),
            'vendor/magento/theme-frontend-blank/web/ts/js/test.ts': `
                export default class Test {
                    echo(msg: string) { 
                        return msg
                    }
                }
            `,
            'vendor/blueacorn/module/view/base/web/ts/js/test.ts': `
                import value from './value';
                import pageBuilderConfig from 'Magento_PageBuilder/js/config';

                export default function logValue() {
                    console.log(pageBuilderConfig);
                    console.log(value);
                }
            `,
            'vendor/blueacorn/module/view/base/web/ts/js/value.ts': `
                export default "hello world";
            `,
            'vendor/magento/module-page-builder/view/adminhtml/web/ts/js/config.ts': `
                export default {};
            `,
        });

        const project = new Project({
            themes: [
                new Theme({
                    sourceDirectory: `vendor/magento/theme-frontend-blank`,
                    area: 'frontend',
                    path: 'Magento/blank'
                })
            ],
            modules: [
                new Module({
                    sourceDirectory: 'vendor/blueacorn/module',
                    name: 'BlueAcorn_Module'
                }),
                new Module({
                    sourceDirectory: 'vendor/magento/module-page-builder',
                    name: 'Magento_PageBuilder'
                }),
            ],
            root: process.cwd(),
            includePath: 'vendor'
        });

        const filePaths = [
            'vendor/magento/theme-frontend-blank/web/js/test.js',
            'vendor/blueacorn/module/view/base/web/js/test.js',
            'vendor/blueacorn/module/view/base/web/js/value.js',
        ];

        const babel = new BabelTypeScript();
        babel.execute(project)(async () => {
            for (const filePath of filePaths) {
                const js = await fs.readFile(filePath);
                expect(js.toString()).toMatchSnapshot();
            }
            done();
        });
    });
});