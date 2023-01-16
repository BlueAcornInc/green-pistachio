import mock from 'mock-fs';
import Module from '../Models/Module';
import Project from '../Models/Project';
import Theme from '../Models/Theme';
import EntryResolver from './EntryResolver';

afterEach(() => {
    mock.restore();
});

describe('Webpack Entry Resolver', () => {
    it('should get theme entries including module bundles', ()=> {});

    // TODO: Rewrite Entry Resolver Tests
    // it('should get theme entries including module bundles', async (done) => {
    //     mock({
    //         'vendor/blueacorn/module-test/view/frontend/web/js/bundles/module.bundle.ts': `export default 42;`,
    //         'app/design/frontend/BlueAcorn/site/web/js/bundles/theme.bundle.ts': ``
    //     });

    //     const theme = new Theme({
    //         sourceDirectory: 'app/design/frontend/BlueAcorn/site',
    //         area: 'frontend',
    //         path: 'BlueAcorn/site'
    //     });

    //     const module = new Module({
    //         sourceDirectory: 'vendor/blueacorn/module-test',
    //         name: 'BlueAcorn_Test'
    //     });

    //     const project = new Project({
    //         modules: [module],
    //         themes: [theme],
    //         root: '',
    //     });

    //     const entryResolver = new EntryResolver();
    //     const entries = await entryResolver.getEntriesForTheme(project, theme);
    //     expect(entries).toMatchSnapshot();
    //     done();
    // });
});
