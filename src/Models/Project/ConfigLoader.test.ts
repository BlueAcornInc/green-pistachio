import { join } from 'path';
import Project from "../Project";
import ConfigLoader from './ConfigLoader';

const createProject = (fixtureDir: string) => {
    return new Project({
        themes: [],
        modules: [],
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
        const fileExists = await configLoader.loadConfig();

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
        const fileExists = await configLoader.loadConfig();

        expect(fileExists).toBeTruthy();
        // @ts-ignore
        expect(project.someProperty).toBe(5);
    });
});