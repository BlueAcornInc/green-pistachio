import { promises as fs } from 'fs';
import { join } from 'path';
import debug from 'debug';
import CommandRunner from "./CommandRunner";
import Module from "./Models/Module";
import Project from "./Models/Project";
import Theme from "./Models/Theme";
const logger = debug('gpc:configBuilder');

type MagentoPaths = {
    modules: Record<string, string>;
    themes: Record<string, string>;
};

export default class ProjectConfigBuilder {
    public static CONFIG_FILE = 'green-pistachio.config.js';
    private rootDirectory: string;

    constructor(
        rootDirectory = process.cwd()
    ) {
        this.rootDirectory = rootDirectory;
    }

    public async build({ includePath = 'app' }): Promise<Project> {
        const { themes, modules } = await this.getPaths();
        const moduleObjects: Module[] = [];

        for (const module of Object.keys(modules)) {
            moduleObjects.push(
                new Module({
                    sourceDirectory: modules[module],
                    name: module
                })
            );
        }

        const themeObjects = await this.processThemes(themes);

        const project = new Project({
            root: this.rootDirectory,
            themes: themeObjects,
            modules: moduleObjects,
            includePath
        });

        const projectConfigFile = join(
            this.rootDirectory,
            ProjectConfigBuilder.CONFIG_FILE
        );

        try {
            const configExists = await fs.stat(projectConfigFile);

            if (configExists) {
                logger('loading project config file');
                try {
                    require(projectConfigFile)(project);
                } catch (err) {
                    logger(`Problem while running user provided configuration file: ${err}`);
                    throw err;
                }
            }
        } catch (err) {
            logger(`No user provided config provided, this is optional, you can create one at: ${projectConfigFile}`);
        }

        project.configure();

        return project;
    }

    private async getPaths() {
        const commandRunner = new CommandRunner();
        
        const command = `
require 'vendor/autoload.php';
echo json_encode([
    'themes' => (new \\Magento\\Framework\\Component\\ComponentRegistrar)->getPaths('theme'),
    'modules' => (new \\Magento\\Framework\\Component\\ComponentRegistrar)->getPaths('module')
]);`;

        const { stdout } = await commandRunner.execute(`php -r "${command}"`);
        const result = JSON.parse(stdout) as MagentoPaths;

        return result;
    }

    private async processThemes(themePaths: Record<string, string>): Promise<Theme[]> {
        const allThemes = Object.keys(themePaths);
        const pathsWithParents = await Promise.all(
            Object.keys(themePaths).map(async (fullThemeName) => {
                const themePath = themePaths[fullThemeName];
                const [ themeArea ] = fullThemeName.split('/');

                const data = await fs.readFile(join(themePath, 'theme.xml'));
                const matchedParent = data.toString().match(/<parent>(.*?)<\/parent>/);
                let parentThemeName;

                if (matchedParent) {
                    const [, parentPath] = matchedParent;

                    parentThemeName = `${themeArea}/${parentPath}`;
                }

                return {
                    themePath,
                    parentThemeName
                }
            })
        );

        const processedThemes: Map<string | undefined, Theme> = new Map();

        while (allThemes.length) {
            const themeName = allThemes.shift();
            
            if (themeName) {
                const [ area, ...restParts ] = themeName.split('/')
                const themePath = restParts.join('/');
                const matchedParentsPath = pathsWithParents.find(path => path.themePath === themePaths[themeName]);
                const parentThemeName = matchedParentsPath && matchedParentsPath.parentThemeName;
                const parentTheme = processedThemes.get(parentThemeName);

                if (parentTheme || !parentThemeName) {
                    processedThemes.set(
                        themeName, 
                        new Theme({
                            sourceDirectory: themePaths[themeName],
                            parent: parentTheme,
                            area: area as "frontend" | "adminhtml",
                            path: themePath
                        })
                    )
                } else {
                    allThemes.push(themeName);
                }
            }
        }

        return Array.from(processedThemes.entries()).map(([, entry]) => entry);
    }
}