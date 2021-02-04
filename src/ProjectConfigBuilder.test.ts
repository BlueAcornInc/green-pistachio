import CommandRunner from './CommandRunner';
import { mocked } from 'ts-jest/utils'; 
import ProjectConfigBuilder from './ProjectConfigBuilder';
import { promises as fs } from 'fs';
import { join } from 'path';
import mock from 'mock-fs';
import Project from './Models/Project';

jest.mock('./CommandRunner');
const mockedCommandRunner = mocked(CommandRunner, true);

beforeEach(() => {
    mocked(CommandRunner).mockClear();
});

afterEach(() => {
    mock.restore();
});

describe('Project Config Builder', () => {
    it('should build on empty project', async () => {
        mockedCommandRunner.prototype.execute.mockImplementation(async () => {
            return {
                error: null,
                stdout: '{"modules": {}, "themes": {}}'
            };
        });

        const projectConfigBuilder = new ProjectConfigBuilder();
        const projectConfig = await projectConfigBuilder.build({});

        expect(projectConfig).toMatchSnapshot({
            root: expect.any(String)
        });
    });

    it('should build themes', async () => {
        mock({
            "vendor/magento/theme-frontend-blank/theme.xml": `<theme xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Config/etc/theme.xsd">
    <title>Magento Blank</title>
    <media>
        <preview_image>media/preview.jpg</preview_image>
    </media>
</theme>`,
        "vendor/magento/theme-frontend-luma/theme.xml": `<theme xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Config/etc/theme.xsd">
        <title>Magento Luma</title>
        <parent>Magento/blank</parent>
        <media>
            <preview_image>media/preview.jpg</preview_image>
        </media>
        </theme>`
        });

        mockedCommandRunner.prototype.execute.mockImplementation(async () => {
            return {
                error: null,
                stdout: '{"modules": {}, "themes": {"frontend/Magento/blank": "vendor/magento/theme-frontend-blank", "frontend/Magento/luma": "vendor/magento/theme-frontend-luma"}}'
            };
        });

        const projectConfigBuilder = new ProjectConfigBuilder();
        const projectConfig = await projectConfigBuilder.build({});

        expect(projectConfig).toMatchSnapshot({
            root: expect.any(String)
        });
    });

    it('should load user provided config file', async () => {
        mockedCommandRunner.prototype.execute.mockImplementation(async () => {
            return {
                error: null,
                stdout: '{"modules": {}, "themes": {}}'
            };
        });

        const configFilePath = join(process.cwd(), ProjectConfigBuilder.CONFIG_FILE);
        await fs.writeFile(configFilePath, `module.exports = (project) => {
            project.someUserProvidedValue = 5;
        }`);

        const projectConfigBuilder = new ProjectConfigBuilder();
        const projectConfig: Project = await projectConfigBuilder.build({});

        await fs.unlink(configFilePath);

        expect((projectConfig as Project & { someUserProvidedValue: number } ).someUserProvidedValue).toBe(5);

        expect(projectConfig).toMatchSnapshot({
            root: expect.any(String)
        });
    });
});