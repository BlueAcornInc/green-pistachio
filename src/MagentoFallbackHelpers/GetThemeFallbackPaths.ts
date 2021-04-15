import { join } from 'path';
import Project from '../Models/Project';
import Theme from "../Models/Theme";

type FallbackPathRequest = {
    path: string;
    theme: Theme;
};

type FallbackPath = {
    type: "module" | "theme" | "lib";
    path: string;
};

class GetThemeFallbackPaths {
    async get(project: Project, request: FallbackPathRequest): Promise<FallbackPath[]> {
        const { path, theme } = request;
        const paths: FallbackPath[] = [];

        paths.push({
            type: 'theme',
            path
        });

        let parentTheme = theme.getParent();

        while (parentTheme) {
            const parentThemePath = path.replace(
                theme.getSourceDirectory(),
                parentTheme.getSourceDirectory()
            );

            paths.push({
                type: 'theme',
                path: parentThemePath
            });

            parentTheme = parentTheme.getParent();
        }

        const [, relativePath ] = path.split(theme.getSourceDirectory());
        const formattedRelativePath = relativePath.replace(/^\//, '');
        const [moduleName, ...relativeModuleFileName] = formattedRelativePath.split('/');
        const module = project.getAllModules().find(module => module.getName() === moduleName);
        const moduleFileName = relativeModuleFileName.join('/')

        if (module) {
            const modulePaths = [
                join(module.getSourceDirectory(), 'view', theme.getData().area, moduleFileName),
                join(module.getSourceDirectory(), 'view', 'base', moduleFileName)
            ];

            for (const modulePath of modulePaths) {
                paths.push({
                    type: 'module',
                    path: modulePath
                });
            }
        }

        if (formattedRelativePath.startsWith('web')) {            
            const libFileName = join(
                project.getRootDirectory(),
                'lib', 
                formattedRelativePath
            );

            paths.push({
                type: 'lib',
                path: libFileName
            });
        }

        return paths;
    }
}

export default GetThemeFallbackPaths;
