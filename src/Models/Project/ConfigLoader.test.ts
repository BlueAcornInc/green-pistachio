import { join } from 'path';
import Module from '../Module';
import Project from "../Project";
import Theme from '../Theme';
import ConfigLoader from './ConfigLoader';

const createProject = (fixtureDir: string) => {
    return new Project({
        themes: [
            new Theme({
                area: 'frontend',
                path: 'BlueAcorn/site',
                sourceDirectory: join(fixtureDir, 'app', 'design', 'frontend', 'BlueAcorn', 'site')
            })
        ],
        modules: [
            new Module({
                sourceDirectory: join(fixtureDir, 'app', 'code', 'BlueAcorn', 'CartApi'),
                name: 'BlueAcorn_CartApi'
            }),
            new Module({
                sourceDirectory: join(fixtureDir, 'app', 'code', 'BlueAcorn', 'CartApiWithoutConfig'),
                name: 'BlueAcorn_CartApiWithoutConfig'
            })
        ],
        root: fixtureDir
    });
};

describe('configLoader', () => {
    it('returns false when file does not exist', async () => {
        const project = createProject(
            join(
                __dirname,
                '__fixtures__',
                'noConfigLoader'
            )
        );

        const configLoader = new ConfigLoader(project);
        const fileExists = await configLoader.configExists();

        expect(fileExists).toBeFalsy();
    });

    it('loads config file properly', async () => {
        const project = createProject(
            join(
                __dirname,
                '__fixtures__',
                'configLoader'
            )
        );

        const configLoader = new ConfigLoader(project);
        await configLoader.loadConfig();

        // @ts-ignore
        expect(project.someProperty).toBe(5);

        // @ts-ignore
        expect(project.somePropertyFromModule).toBe(2);

        // @ts-ignore
        expect(project.somePropertyFromTheme).toBe(3);
    });
});
