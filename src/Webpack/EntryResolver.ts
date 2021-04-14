import glob from 'fast-glob';
import debug from 'debug';
import { join } from 'path';
import { promises as fs } from 'fs';
import Project from "../Models/Project";
import Theme from "../Models/Theme";
import ThemeOverridePath, { ThemeOverridePathRequest } from '../MagentoFallbackHelpers/ThemeOverridePath';
import Module from '../Models/Module';
const logger = debug('gpc:webpack:entryResolver');

type ThemeEntriesResult = {
    virtualEntries: VirtualEntry[];
    entries: PhysicalEntry[];
};

type PhysicalEntry = {
    sourcePath: string;
    destinationPath: string;
};

export type VirtualEntry = {
    module: Module;
    sourcePath: string;
    destinationPath: string;
    content: string;
};

type PathRequest = {
    filename: string;
    module: Module;
};

export default class EntryResolver {
    private moduleEntryData?: PathRequest[];

    public async resolve(project: Project, theme?: Theme): Promise<Record<string, string>> {
        const entriesRaw: string[] = await glob(this.getGlobs(project, theme));

        const entries = entriesRaw.reduce((memo, entry) => ({
            ...memo,
            [`.${entry.replace('/bundles', '').replace(project.getRootDirectory(), '').replace(/\.(js|ts|tsx|jsx)$/, '.js')}`]: entry
        }), {});

        logger(`Resolved Entries: ${JSON.stringify(entries)}`);

        return entries;
    }

    public async getEntriesForTheme(project: Project, theme: Theme): Promise<ThemeEntriesResult> {
        const result: ThemeEntriesResult = {
            virtualEntries: [],
            entries: []
        };
        const physicalEntries = await glob(
            join(
                theme.getSourceDirectory(),
                '/**/js/bundles/**/*.bundle.{js,ts,tsx,jsx}'
            )
        );

        result.entries = physicalEntries.map(entry => {
            // 1. Remove Theme Directory
            // ${themedir}/web/js/bundles/test.bundle.ts
            // ${themedir}/BlueAcorn_Module/web/js/bundles/test.bundle.tsx
            const normalizedPath = entry.replace(theme.getSourceDirectory(), '');
            let outputPath = normalizedPath
                .replace('web/js/', '')
                .replace('bundles/', '');
            let moduleName = '';

            // 2. Remove and store module name
            // test.bundle.ts
            // BlueAcorn_Module/test.bundle.tsx
            if (!outputPath.startsWith('web')) {
                const part = outputPath.split('/').shift();

                if (part) {
                    moduleName = part;
                    outputPath = outputPath.replace(`${moduleName}/`, '');
                }
            }

            // 3. Add Module Name Back
            // test.bundle.ts
            // test.bundle.tsx
            if (moduleName) {
                outputPath = `${moduleName}.${outputPath}`;
            }

            // 4. Normalize extension type
            // test.bundle.ts
            // BlueAcorn_Module.test.bundle.tsx
            outputPath = outputPath.replace(/\.(js|ts|tsx|jsx)$/, '');

            // 5. Result
            // test.bundle.js
            // BlueAcorn_Module.test.bundle.js
            return {
                sourcePath: normalizedPath,
                destinationPath: outputPath
            }
        });

        const themeOverridePathBuilder = new ThemeOverridePath();
        const entryPathRequests = await this.getModuleEntryData(project);

        for (const entryPathRequest of entryPathRequests) {
            const {
                filename,
                webpackOutputFilePath
            } = themeOverridePathBuilder.build({
                ...entryPathRequest,
                theme: theme
            });
            const outputPath = webpackOutputFilePath.replace('/bundles', '').replace(/\.(js|ts|tsx|jsx)$/, '');
            const content = await fs.readFile(entryPathRequest.filename);

            result.virtualEntries.push({
                module: entryPathRequest.module,
                sourcePath: filename,
                destinationPath: outputPath,
                content: content.toString()
            });
        }

        return result;
    }

    public async getEntriesForModules(project: Project): Promise<PhysicalEntry[]> {
        const entryPathRequests = await this.getModuleEntryData(project);
        const entries: PhysicalEntry[] = [];
        
        for (const entryPathRequest of entryPathRequests) {
            entries.push({
                sourcePath: entryPathRequest.filename,
                destinationPath: entryPathRequest.filename
                    .replace(project.getRootDirectory(), '')
                    .replace('/bundles', '')
                    .replace(/\.(js|ts|tsx|jsx)$/, '')
            });
        }

        return entries;
    }

    private async getModuleEntryData(project: Project): Promise<PathRequest[]> {
        if (!this.moduleEntryData) {
            const entryData: PathRequest[] = [];

            await Promise.all(
                project.getAllModules().map(async module => {
                    const entries = await glob(
                        join(
                            module.getSourceDirectory(),
                            '/view/*/web/js/bundles/**/*.bundle.{js,ts,tsx,jsx}'
                        )
                    );

                    for (const entry of entries) {
                        entryData.push({
                            filename: entry,
                            module
                        });
                    }
                })
            );

            this.moduleEntryData = entryData;
        }

        return this.moduleEntryData;
    }

    public getGlobs(project: Project, theme?: Theme): string[] {
        const themes = theme ? [theme] : project.getThemes();
        const globs = [];

        for (const module of project.getModules()) {
            globs.push(
                join(
                    module.getSourceDirectory(),
                    '/view/*/web/js/bundles/**/*.bundle.{js,ts,tsx,jsx}'
                )
            );
        }

        for (const theme of themes) {
            globs.push(
                join(
                    theme.getSourceDirectory(),
                    '/**/js/bundles/**/*.bundle.{js,ts,tsx,jsx}'
                )
            );
        }

        project.hooks.webpack.entryGlobs.call(globs);
        logger(`Entry globs: ${JSON.stringify(globs)}`);

        return globs;
    }
}