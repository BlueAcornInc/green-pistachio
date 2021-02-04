import glob from 'fast-glob';
import debug from 'debug';
import { join } from 'path';
import Project from "../Models/Project";
import Theme from "../Models/Theme";
const logger = debug('gpc:webpack:entryResolver');

export default class EntryResolver {
    public async resolve(project: Project, theme?: Theme): Promise<Record<string, string>> {
        const entriesRaw: string[] = await glob(this.getGlobs(project, theme));

        const entries = entriesRaw.reduce((memo, entry) => ({
            ...memo,
            [`.${entry.replace('/bundles', '').replace(project.getRootDirectory(), '').replace(/\.(js|ts|tsx|jsx)$/, '.js')}`]: entry
        }), {});

        logger(`Resolved Entries: ${JSON.stringify(entries)}`);

        return entries;
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