import glob from 'fast-glob';
import debug from 'debug';
import { join } from 'path';
import Project from "../Models/Project";
import Theme from "../Models/Theme";
import Module from '../Models/Module';
const logger = debug('gpc:webpack:entryResolver');

export enum EntryType {
    Module,
    Theme,
    ModuleOverride
};

export interface Entry {
    sourcePath: string;
    destinationPath: string;
    type: EntryType;
    module?: Module;
    content?: string;
};

export default class EntryResolver {
    private moduleEntries?: Entry[];

    /**
     * Resolve entries for all modules
     * 
     * @param project Project
     * @returns Entry[]
     */
    public async getEntriesForModules(project: Project): Promise<Entry[]> {
        if (!this.moduleEntries) {
            const entries: Entry[] = [];

            await Promise.all(
                project.getAllModules().map(async module => {
                    const entryFiles = await glob(
                        join(
                            module.getSourceDirectory(),
                            '/view/*/web/js/bundles/**/*.bundle.{js,ts,tsx,jsx}'
                        )
                    );
    
                    for (const sourcePath of entryFiles) {
                        const destinationPath = sourcePath
                            .replace(project.getRootDirectory(), '')
                            .replace('/bundles', '')
                            .replace(/\.(js|ts|tsx|jsx)$/, '')
                            .replace(/^\//, '');
    
                        entries.push({
                            type: EntryType.Module,
                            sourcePath,
                            destinationPath,
                            module
                        });
                    }
                })
            );

            this.moduleEntries = entries;
        }

        return this.moduleEntries;
    }

    /**
     * Resolve entries for provided theme
     * 
     * @param project Project
     * @param theme Theme
     * @returns Entry[]
     */
    public async getEntriesForTheme(project: Project, theme: Theme): Promise<Entry[]> {
        // const entries: Entry[] = [];
        const entries: Map<string, Entry> = new Map();

        const physicalEntries = await glob(
            join(
                theme.getSourceDirectory(),
                '/**/js/bundles/**/*.bundle.{js,ts,tsx,jsx}'
            )
        );

        for (const entry of physicalEntries) {
            const sourcePath = entry.replace(theme.getSourceDirectory(), '');
            let destinationPath = sourcePath
                .replace('web/js/', '')
                .replace('bundles/', '');
            let moduleName = '';

            if (!destinationPath.startsWith('web')) {
                const part = destinationPath.split('/').shift();

                if (part) {
                    moduleName = part;
                    destinationPath = destinationPath.replace(`${moduleName}/`, '');
                }
            }
            
            if (moduleName) {
                destinationPath = `${moduleName}.${destinationPath}`;
            }
            
            destinationPath = destinationPath.replace(/\.(js|ts|tsx|jsx)$/, '').replace(/^\//, '');

            entries.set(sourcePath, {
                type: EntryType.Theme,
                sourcePath,
                destinationPath
            });
        }

        const moduleEntryData = await this.getEntriesForModules(project);

        for (const moduleEntry of moduleEntryData) {
            const module = moduleEntry.module && moduleEntry.module;

            if (!module) {
                continue;
            }

            const sourcePath = join(
                theme.getSourceDirectory(),
                module.getName(),
                moduleEntry.sourcePath
                    .replace(module.getSourceDirectory(), '')
                    .replace(`view/${theme.getData().area}/`, '')
            );

            const destinationPath = join(
                module.getName(),
                moduleEntry.sourcePath
                    .replace(module.getSourceDirectory(), '')
                    .replace(`/view/${theme.getData().area}/web/js/bundles/`, '')
                    .replace('/bundles', '')
                    .replace(/\.(js|ts|tsx|jsx)$/, '')
            );    
        
            const existingEntry = entries.get(sourcePath);

            if (existingEntry) {
                entries.set(sourcePath, {
                    ...existingEntry,
                    type: EntryType.ModuleOverride,
                    module: moduleEntry.module
                });
            } else {
                entries.set(sourcePath, {
                    ...moduleEntry,
                    sourcePath,
                    destinationPath,
                    type: EntryType.ModuleOverride
                });
            }
        }

        return Array.from(entries.values());
    }
}