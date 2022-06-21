/**
 * @jest-environment node
 */
import mock from 'mock-fs';
import Project from '../../Models/Project';
import Theme from '../../Models/Theme';
import fs from 'fs';
import Clean from './Clean';

afterEach(() => {
    mock.restore();
});

describe('Gulp: Clean', () => {
    it('should clean the project', () => {});

    //TODO: Rewrite Clean Tests
    // it('should clean paths', async (done) => {
    //     const files = {
    //         'pub/static/frontend/Magento/blank/en_US/js/test.js': '',
    //         'pub/static/_requirejs/something.txt': '',
    //         'pub/static/deployed_version.txt': ''
    //     };

    //     mock(files);

    //     const project = new Project({
    //         themes: [
    //             new Theme({
    //                 sourceDirectory: `vendor/magento/theme-frontend-blank`,
    //                 area: 'frontend',
    //                 path: 'Magento/blank',
    //                 enabled: true
    //             })
    //         ],
    //         modules: [],
    //         root: ''
    //     });

    //     const clean = new Clean();
    //     clean.execute(project)(async () => {
    //         for (const file of Object.keys(files)) {
    //             expect(fs.existsSync(file)).toBe(false);
    //         }

    //         done();
    //     });
    // });
});
