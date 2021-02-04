/**
 * @jest-environment node
 */
import { join } from 'path';
import { promises as fs } from 'fs';
import Project from '../../Models/Project';
import Theme from '../../Models/Theme';
import Webpack from './Webpack';
import Module from '../../Models/Module';

// afterEach(() => {
//     mock.restore();
// });

describe('Gulp: Webpack', () => {
    it('should compile webpack', async (done) => {
        const root = join(
            __dirname,
            '__fixtures__',
            'webpack'
        );

        const expectedOutputFiles = [
            `${root}/app/design/frontend/BlueAcorn/site/web/js/test-ts.bundle.js`,
            `${root}/app/design/frontend/BlueAcorn/site/web/js/test.bundle.js`,
            `${root}/app/code/BlueAcorn/Module/view/frontend/web/js/module.bundle.js`
        ];

        const project = new Project({
            themes: [
                new Theme({
                    sourceDirectory: `${root}/app/design/frontend/BlueAcorn/site`,
                    area: 'frontend',
                    path: 'BlueAcorn/site'
                })
            ],
            modules: [
                new Module({
                    name: 'BlueAcorn_Module',
                    sourceDirectory: `${root}/app/code/BlueAcorn/Module`
                })
            ],
            root,
            includePath: 'app'
        });

        const webpack = new Webpack();
        webpack.execute(project)(async () => {
            for (const expectedOutputFile of expectedOutputFiles) {
                const contents = await fs.readFile(expectedOutputFile);
                expect(contents.toString()).toMatchSnapshot();
                await fs.unlink(expectedOutputFile)
            }
            done();
        });
    });
});