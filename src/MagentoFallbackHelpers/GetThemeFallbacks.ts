import { promises as fs } from 'fs';
import { join } from 'path';
import Project from '../Models/Project';
import Theme from "../Models/Theme";
import FileLocator from "./FileLocator";

type FallbackPathRequest = {
    filename: string;
    theme: Theme;
    shallow?: boolean;
};

type FallbackPath = {
    type: "module" | "theme" | "lib";
    filename: string;
};

class GetThemeFallbacks {
    private moduleFileLocator: FileLocator;

    constructor() {
        this.moduleFileLocator = new FileLocator();
    }

    async get(project: Project, request: FallbackPathRequest): Promise<FallbackPath[] | FallbackPath> {
        const { filename, theme, shallow } = request;
        const paths: FallbackPath[] = [];
        const isShallowRequest = !!shallow;

        try {
            const exists = await fs.stat(filename);

            if (exists) {
                paths.push({
                    type: 'theme',
                    filename
                });

                if (isShallowRequest) {
                    return paths[0];
                }
            }
        } catch (err) {}

        let parentTheme = theme.getParent();

        while (parentTheme) {
            const parentFileName = filename.replace(
                theme.getSourceDirectory(),
                parentTheme.getSourceDirectory()
            );

            try {
                const exists = await fs.stat(parentFileName);

                if (exists) {
                    paths.push({
                        type: 'theme',
                        filename: parentFileName
                    });

                    if (isShallowRequest) {
                        return paths[0];
                    }                    
                }
            } catch (err) {}

            parentTheme = parentTheme.getParent();
        }

        const [, relativePath ] = filename.split(theme.getSourceDirectory());
        const formattedRelativePath = relativePath.replace(/^\//, '');
        const [moduleName, ...relativeModuleFileName] = formattedRelativePath.split('/');
        const fileLocatorResult = await this.moduleFileLocator.locate(project, {
            filename: relativeModuleFileName.join('/'),
            moduleName,
            area: theme.getData().area
        });

        if (fileLocatorResult.found && fileLocatorResult.path) {
            paths.push({
                type: 'module',
                filename: fileLocatorResult.path
            });

            if (isShallowRequest) {
                return paths[0];
            }
        }

        if (formattedRelativePath.startsWith('web')) {            
            try {
                const libFileName = join(
                    project.getRootDirectory(),
                    'lib', 
                    formattedRelativePath
                );

                const exists = await fs.stat(libFileName);

                if (exists) {
                    paths.push({
                        type: 'lib',
                        filename: libFileName
                    });

                    if (isShallowRequest) {
                        return paths[0];
                    }
                }
            } catch (err) {}
        }

        return paths;
    }
}

export default GetThemeFallbacks;
