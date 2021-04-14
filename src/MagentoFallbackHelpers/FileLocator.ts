import { promises as fs } from 'fs';
import { join } from 'path';
import Project from '../Models/Project';

type FileLocatorRequest = {
    filename: string;
    moduleName: string;
    area: "frontend" | "adminhtml";
};

type FileLocatorResult = {
    found: boolean;
    path?: string;
};

export default class FileLocator {
    async locate(project: Project, fileLocatorRequest: FileLocatorRequest): Promise<FileLocatorResult> {
        const { filename, moduleName, area } = fileLocatorRequest;
        let module = project.getModules().find(module => module.getName() === moduleName);
        
        if (module) {
            const possibleFiles = [
                join(module.getSourceDirectory(), 'view', area, filename),
                join(module.getSourceDirectory(), 'view', 'base', filename)
            ];

            for (const possibleFile of possibleFiles) {
                try {
                    const stat = await fs.stat(possibleFile);
                    if (stat) {
                        return {
                            found: true,
                            path: possibleFile
                        };
                    }
                } catch (err) {}
            }
        }

        return {
            found: false
        };
    }
}