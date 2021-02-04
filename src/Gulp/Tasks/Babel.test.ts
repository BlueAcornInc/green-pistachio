/**
 * @jest-environment node
 */
import mock from 'mock-fs';
import { join } from 'path';
import Project from '../../Models/Project';
import Theme from '../../Models/Theme';
import Babel from './Babel';
import { promises as fs } from 'fs';
import Module from '../../Models/Module';

afterEach(() => {
    mock.restore();
});

describe('Gulp: Babel', () => {
    it('should compile babel', async (done) => {
        mock({
            'node_modules': mock.load(join(__dirname, '..', '..', '..', 'node_modules')),
            'vendor/magento/theme-frontend-blank/web/js/source/test.js': 'console.log("hello world");',
            'vendor/magento/theme-frontend-blank/web/js/source/test-ts-dep.js': 'export default "hello world"',
            'vendor/magento/theme-frontend-blank/web/js/source/test-ts.js': 'import msg from "./test-ts-dep"; console.log(msg); export default (msg) => { console.log(msg) }',
            'vendor/magento/module-test/view/adminhtml/web/js/source/module-file.js': 'console.log("module")'
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
                    sourceDirectory: 'vendor/magento/module-test',
                    name: 'Module_Test'
                })
            ],
            root: '',
            includePath: 'vendor'
        });

        const babel = new Babel();
        babel.execute(project)(async () => {
            const themeJs = await fs.readFile(`vendor/magento/theme-frontend-blank/web/js/test.js`);
            expect(themeJs.toString()).toMatchSnapshot();
            const themeTs = await fs.readFile(`vendor/magento/theme-frontend-blank/web/js/test-ts.js`);
            expect(themeTs.toString()).toMatchSnapshot();
            
            const moduleJs = await fs.readFile(`vendor/magento/module-test/view/adminhtml/web/js/module-file.js`);
            expect(moduleJs.toString()).toMatchSnapshot();
            done();
        });
    });
});