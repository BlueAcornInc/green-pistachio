import mock from 'mock-fs';
import { promises as fs } from 'fs';
import Module from "../Module";
import Project from "../Project";
import Theme from "../Theme";
import TsConfigBuilder from './TsConfigBuilder';

afterEach(() => {
    mock.restore();
});

describe('TS Config Builder', () => {
    it('should generate ts config from project', async () => {
        mock();
        const project = new Project({
            themes: [
                new Theme({
                    area: 'frontend',
                    path: 'Magento/blank',
                    sourceDirectory: 'vendor/magento/theme-frontend-blank'
                }),
                new Theme({
                    area: 'frontend',
                    path: 'Magento/luma',
                    sourceDirectory: 'vendor/magento/theme-frontend-luma'
                }),
                new Theme({
                    area: 'frontend',
                    path: 'BlueAcorn/site',
                    sourceDirectory: 'app/design/frontend/BlueAcorn/site'
                }),
                new Theme({
                    area: 'adminhtml',
                    path: 'Magento/backend',
                    sourceDirectory: 'vendor/magento/theme-adminhtml-backend'
                })
            ],
            modules: [
                new Module({
                    name: 'Magento_Theme',
                    sourceDirectory: 'vendor/magento/module-theme'
                }),
                new Module({
                    name: 'BlueAcorn_Core',
                    sourceDirectory: 'app/code/BlueAcorn/Core'
                })
            ],
            root: '',
        });

        const tsConfigBuilder = new TsConfigBuilder();
        const filePath = await tsConfigBuilder.emitConfigFile(project);

        const fileContent = await fs.readFile(filePath);
        expect(fileContent.toString()).toMatchSnapshot();
    });
});