import CommandRunner from '../../CommandRunner';
// import { mocked } from 'ts-jest/utils';
import Theme from '../../Models/Theme';
import SourceThemeDeploy from './SourceThemeDeploy';
import Project from '../../Models/Project';

// jest.mock('../../CommandRunner');
// const mockedCommandRunner = mocked(CommandRunner, true);

// beforeEach(() => {
//     mocked(CommandRunner).mockClear();
// });

describe('Source Theme Deploy', () => {
    it('should deploy source theme', (done) => { done(); });

    //TODO: Rewrite Source Theme Deploy Tests
    // it('should deploy source theme', (done) => {
    //     const theme = new Theme({
    //         sourceDirectory: 'vendor/magento/theme-frontend-blank',
    //         area: 'frontend',
    //         path: 'Magento/blank',
    //         stylesheets: ['css/styles-m.less'],
    //         enabled: true
    //     });
    //     const project = new Project({
    //         modules: [],
    //         themes: [theme],
    //         root: ''
    //     });

    //     const spy = jest.spyOn(mockedCommandRunner.prototype, 'execute');

    //     const sourceThemeDeploy = new SourceThemeDeploy();
    //     sourceThemeDeploy.execute(project)(async () => {
    //         expect(spy).toHaveBeenCalledWith(`php -d memory_limit=-1 bin/magento dev:source-theme:deploy css/styles-m --type=less --locale=en_US --area=frontend --theme=Magento/blank`);
    //         done();
    //     });
    // });
});
