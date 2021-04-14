import debug from 'debug';
import { Compiler } from 'webpack';
import { WebpackManifestPlugin, getCompilerHooks } from 'webpack-manifest-plugin';
import { promises as fs } from 'fs';
import { join } from 'path';
import { VirtualEntry } from '../EntryResolver';
const logger = debug('gpc:webpack:MagentoRequireJsManifestPlugin');

/**
 * Creates, or modifies theme level requirejs-config.js file to map file names to
 * output paths.
 */
export default class MagentoRequireJsManifestPlugin {
    static magicCommentRegex = /\/\*\* START: MagentoRequireJsManifestPlugin[\s\S]*\/\*\* END: MagentoRequireJsManifestPlugin \*\//g

    private compiler!: Compiler;
    private virtualEntries: VirtualEntry[];

    constructor(virtualEntries: VirtualEntry[]) {
        this.virtualEntries = virtualEntries;
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
                compiler.outputPath,
                '..',
                '..',
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
        const dependencies = [
            'vendors.js',
            'styles.js',
            'commons.js',
        ];
        const discoveredDependencies = [];
        let generate = false;
        let code = `\nconfig = config || {};`;

        for (const dependency of dependencies) {
            if (manifest[dependency]) {
                discoveredDependencies.push(`bundle/${dependency.replace('.js', '')}`);
            }
        }

        /**
         * Split chunk support via requirejs deps
         */
        if (discoveredDependencies.length > 0) {
            generate = true;
            code += `\nconfig.deps = (config.deps || []).concat(${JSON.stringify(discoveredDependencies, null, 4)});`;
        }

        /**
         * Module level compilation with theme level override support
         */
        const moduleMap: Record<string, string> = {};
        
        for (const virtualEntry of this.virtualEntries) {
            logger(virtualEntry.sourcePath, this.compiler.outputPath);
            moduleMap[`bundle/${virtualEntry.destinationPath}`] = virtualEntry.sourcePath
                .replace(join(
                    this.compiler.outputPath,
                    '..',
                    '..'
                ), '')
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
