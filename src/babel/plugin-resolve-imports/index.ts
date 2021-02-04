import debug from 'debug';
import path from 'path';
import * as BabelTypes from "@babel/types";
import { Visitor, NodePath } from '@babel/traverse';
import Project from '../../Models/Project';
const logger = debug('gpc:babel-plugin:resolve-imports');

export interface Babel {
    types: typeof BabelTypes;
}

export interface PluginOptions {
    file: {
        path: NodePath;
        opts: {
            filename: string;
        }
    };
}

/**
 * Babel plugin converting relative paths to magento compatible AMD paths
 * e.g. ../abc => Magento_Module/js/abc
 * e.g. ./sample/file => Magento_Module/js/sample/file
 * 
 * @param {Project} project
 */
export default function babelResolveImports(project: Project): { visitor: Visitor<PluginOptions> } {
    const searchDirectories = new Map();
    const getSearchDirectories = () => {
        if (searchDirectories.size === 0) {
            logger('generating search directories');
            const themes = project.getAllThemes();
            const modules = project.getAllModules();
            const areas = ['adminhtml', 'base', 'frontend'];

            for (const module of modules) {
                for (const area of areas) {
                    searchDirectories.set(
                        path.join(
                            module.getSourceDirectory(),
                            'view',
                            area,
                            'web',
                            'ts'
                        ),
                        module.getName()
                    );
                }

                for (const theme of themes) {
                    searchDirectories.set(
                        path.join(
                            theme.getSourceDirectory(),
                            module.getName(),
                            'web',
                            'ts'
                        ),
                        module.getName()
                    );
                }
            }

            for (const theme of themes) {
                searchDirectories.set(
                    path.join(
                        theme.getSourceDirectory(),
                        'web',
                        'ts'
                    ),
                    ''
                );
            }
            logger(JSON.stringify(Array.from(searchDirectories)));
        }

        return searchDirectories;
    };

    return {
        visitor: {
            ImportDeclaration(importPath, state) {
                const importNodeValue = importPath.node.source.value;

                if (!project) {
                    logger('no project provided')
                    throw Error('Project must be provided');
                }

                if (!path.isAbsolute(importNodeValue) && importNodeValue.includes('./')) {
                    for (const [directory, filepath] of getSearchDirectories()) {
                        if (state.file.opts.filename.includes(directory)) {
                            importPath.node.source.value = path.resolve(
                                path.dirname(
                                    state.file.opts.filename.replace(
                                        directory,
                                        ''
                                    )
                                ),
                                importNodeValue
                            ).replace(
                                project.getRootDirectory(),
                                filepath
                            );
                            break;
                        }
                    }
                }
            }
        }
    };
};