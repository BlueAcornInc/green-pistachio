import debug from 'debug';
import { Compiler } from 'webpack';
import { WebpackManifestPlugin, getCompilerHooks } from 'webpack-manifest-plugin';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Entry, EntryType } from '../EntryResolver';
import Project from '../../Models/Project';
import Theme from '../../Models/Theme';
const logger = debug('gpc:webpack:MagentoRequireJsManifestPlugin');

/**
 * Creates, or modifies theme level requirejs-config.js file to map file names to
 * output paths.
 */
export default class MagentoRequireJsManifestPlugin {
    static magicCommentRegex = /\/\*\* START: MagentoRequireJsManifestPlugin[\s\S]*\/\*\* END: MagentoRequireJsManifestPlugin \*\//g

    private compiler!: Compiler;
    private project: Project;
    private theme: Theme;
    private entries: Entry[];

    constructor(
        project: Project,
        theme: Theme,
        entries: Entry[]
    ) {
        this.project = project;
        this.theme = theme;
        this.entries = entries;
    }

    /**
     * This webpack plugin should generate, or modify the theme level requirejs-config.js file in order to:
     * 
     * 1. Add deps for common, vendor, and styles bundles if they exists, by referencing the manifest data provided
     * 2. Add map for compiled module bundle to theme level override bundle, allowing for theme level customizations on module bundles
     * 
     * @param compiler | Compiler
     */
    apply(compiler: Compiler) {
        this.compiler = compiler;

        const webpackManifestPlugin = new WebpackManifestPlugin({
            writeToFileEmit: false
        });

        // @ts-ignore
        webpackManifestPlugin.apply(compiler);
        // @ts-ignore
        const { afterEmit } = getCompilerHooks(compiler);

        afterEmit.tap('MagentoRequireJsManifestPlugin', async (manifest: Record<string, string>) => {
            logger(manifest);
            const requirejsPath = join(
                this.theme.getSourceDirectory(),
                'requirejs-config.js'
            );
            const generatedCode = this.getGeneratedRequireJsCode(manifest);

            if (!generatedCode) {
                return;
            }

            let requirejsConfigContent = '';

            try {
                const contentBuffer = await fs.readFile(requirejsPath);
                requirejsConfigContent = contentBuffer.toString();
            } catch (err) {}

            if (requirejsConfigContent.match(MagentoRequireJsManifestPlugin.magicCommentRegex)) {
                // File exists, magic comment is found
                requirejsConfigContent = requirejsConfigContent.replace(
                    MagentoRequireJsManifestPlugin.magicCommentRegex,
                    this.getGeneratedRequireJsCode(manifest)
                );
            } else if (requirejsConfigContent) {
                // File exists, no magic comment
                requirejsConfigContent += `\n\n${this.getGeneratedRequireJsCode(manifest)}`;
            } else {
                // File does not exist
                requirejsConfigContent = `var config = {};\n\n${this.getGeneratedRequireJsCode(manifest)}`;
            }

            try {
                await fs.writeFile(requirejsPath, requirejsConfigContent);
            } catch (err) {
                logger(`Unable to write requirejs-config.js file: ${err}`);
            }
        });
    }

    private getGeneratedRequireJsCode(manifest: Record<string, string>): string
    {
        let generate = false;
        let code = `\nconfig = config || {};`;

        /**
         * Module level compilation with theme level override support
         */
        const moduleMap: Record<string, string> = {};

        for (const entry of this.entries) {
            if (entry.type !== EntryType.ModuleOverride) {
                continue;
            }

            moduleMap[`bundle/${entry.destinationPath}`] = entry.sourcePath
                .replace(this.theme.getSourceDirectory(), '')
                .replace(/^\//, '')
                .replace('web/', '')
                .replace('bundles/', '')
                .replace(/\.(js|ts|tsx|jsx)$/, '');
        }

        if (Object.keys(moduleMap).length > 0) {
            generate = true;
            code += `
config.map = (config.map || {});
config.map['*'] = (config.map['*'] || {});`;

            for (const themeLevelOverride of Object.keys(moduleMap)) {
                code += `
config.map['*']['${moduleMap[themeLevelOverride]}'] = '${themeLevelOverride}';`;
            }
        }

        return generate ? `/** START: MagentoRequireJsManifestPlugin */${code}\n/** END: MagentoRequireJsManifestPlugin */` : '';
    }
}
