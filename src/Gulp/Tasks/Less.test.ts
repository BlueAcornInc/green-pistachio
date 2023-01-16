/**
 * @jest-environment node
 */
import mock from 'mock-fs';
import { join } from 'path';
import Project from '../../Models/Project';
import Theme from '../../Models/Theme';
import Less from './Less';
import { promises as fs } from 'fs';

afterEach(() => {
    mock.restore();
});

describe('Gulp: Less', () => {
    it('should compile less', ()=> {});

    //TODO: Rewrite Less Tests
    // it('should compile less', async (done) => {
    //     mock({
    //         'node_modules': mock.load(join(__dirname, '..', '..', '..', 'node_modules')),
    //         'vendor/magento/theme-frontend-blank/web/css/styles.less': '',
    //         'pub/static/frontend/Magento/blank/en_US/css/styles.less': '@color: blue; p { color: @color }'
    //     });

    //     const project = new Project({
    //         themes: [
    //             new Theme({
    //                 sourceDirectory: `vendor/magento/theme-frontend-blank`,
    //                 area: 'frontend',
    //                 path: 'Magento/blank',
    //                 enabled: true,
    //             })
    //         ],
    //         modules: [],
    //         root: '',
    //     });

    //     const less = new Less();
    //     less.execute(project)(async () => {
    //         const styles = await fs.readFile(`pub/static/frontend/Magento/blank/en_US/css/styles.css`);
    //         expect(styles.toString()).toMatchSnapshot();
    //         done();
    //     });
    // });
});
