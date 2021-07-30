import { Chunk, Compiler, ExternalModule, JavascriptModulesPlugin, NormalModule, RuntimeGlobals, Template, WebpackPluginInstance } from "webpack";
import { ConcatSource, Source } from "webpack-sources";
import { basename, dirname, join, relative } from 'path';

export default class MagentoAmdLibraryPlugin implements WebpackPluginInstance {
    public static PluginName = 'MagentoAmdLibraryPlugin';

    apply(compiler: Compiler) {
        // Tap into the compilation
        compiler.hooks.thisCompilation.tap(
            MagentoAmdLibraryPlugin.PluginName, 
            compilation => {
                const asyncChunks = new Set();

                const isEntryChunk = (chunk: Chunk): boolean => {
                    return compilation.chunkGraph.getNumberOfEntryModules(chunk) > 0;
                };

                compilation.hooks.additionalChunkRuntimeRequirements.tap(
                    MagentoAmdLibraryPlugin.PluginName,
                    (chunk, set) => {
                        if (isEntryChunk(chunk)) {
                            set.add(RuntimeGlobals.returnExportsFromRuntime);
                        }
                    }
                );

                const hooks = JavascriptModulesPlugin.getCompilationHooks(compilation);

                // Determine which chunks are async
                compilation.hooks.renderManifest.tap(
                    MagentoAmdLibraryPlugin.PluginName,
                    (result, options) => {
                        const { chunk } = options;

                        for (const asyncChunk of chunk.getAllAsyncChunks()) {
                            asyncChunks.add(asyncChunk);
                        }
                        
                        return result;
                    }
                );

                hooks.render.tap(
                    MagentoAmdLibraryPlugin.PluginName,
                    // @ts-ignore
                    (source, renderContext) => {
                        const { runtimeTemplate, chunkGraph, chunk, moduleGraph } = renderContext;

                        // Bail here for async chunks / lazy imports, webpack handles loading for these
                        if (asyncChunks.has(chunk)) {
                            return source;
                        }

                        const modern = runtimeTemplate.supportsArrowFunction();
                        const iife = runtimeTemplate.isIIFE();
                        let fnStart =
                            (modern
                                ? `() => {`
                                : `function() {`) +
                            (iife || !chunk.hasRuntime() ? " return " : "\n");
                        const fnEnd = iife ? ";\n}" : "\n}";

                        if (isEntryChunk(chunk)) {
                            // Render AMD Entry                            
                            const modules = chunkGraph.getChunkModules(chunk).filter(m => m instanceof ExternalModule) as ExternalModule[];
                            const externals = modules;
                            const deps = externals.map(m => 
                                typeof m.request === 'object' && !Array.isArray(m.request)
                                    ? m.request.amd
                                    : m.request
                            );
                            const currentChunkPathInfo = compilation.getPathWithInfo(
                                JavascriptModulesPlugin.getChunkFilenameTemplate(chunk, compilation.outputOptions),
                                {
                                    chunk,
                                    contentHashType: 'javascript',
                                    runtime: chunk.runtime
                                }
                            );

                            for (const dependency of chunkGraph.getChunkEntryDependentChunksIterable(chunk)) {
                                const dependencyPath = compilation.getPathWithInfo(
                                    JavascriptModulesPlugin.getChunkFilenameTemplate(dependency, compilation.outputOptions),
                                    {
                                        chunk: dependency,
                                        contentHashType: 'javascript',
                                        runtime: dependency.runtime
                                    }
                                );

                                const pathToDependency = relative(
                                    dirname(currentChunkPathInfo.path),
                                    dirname(dependencyPath.path)
                                ) || '.'

                                let depPath = join(pathToDependency, basename(dependencyPath.path).replace(/\.js$/, ''));
                                if (!depPath.startsWith('.')) {
                                    depPath = `./${depPath}`;
                                }

                                deps.push(depPath);
                            }

                            const externalsDepsArray = JSON.stringify(deps);
                            const externalsArguments = externals.map(m => 
                                `__WEBPACK_EXTERNAL_MODULE_${Template.toIdentifier(
                                    `${chunkGraph.getModuleId(m)}`
                                )}__`
                            ).join(', ');

                            if (deps.length > 0) {
                                fnStart =
                                    (modern
                                        ? `(${externalsArguments}) => {`
                                        : `function(${externalsArguments}) {`) +
                                    (iife || !chunk.hasRuntime() ? " return " : "\n");

                                return new ConcatSource(
                                    `define(${externalsDepsArray}, ${fnStart}`,
                                    source as Source,
                                    `${fnEnd});`
                                );
                            } else {
                                return new ConcatSource(`define(${fnStart}`, (source as Source) ,`${fnEnd});`);
                            }
                        } else {
                            // Render chunk
                            return new ConcatSource(`define(${fnStart}`, (source as Source) ,`${fnEnd});`);
                        }
                    }
                );

                hooks.chunkHash.tap(MagentoAmdLibraryPlugin.PluginName, (chunk, hash) => {
                    hash.update(MagentoAmdLibraryPlugin.PluginName);
                });
            }
        );
    }
}