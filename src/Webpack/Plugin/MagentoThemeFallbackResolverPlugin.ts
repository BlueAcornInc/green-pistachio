import { Resolver, ResolveRequest } from 'enhanced-resolve';
import debug from 'debug';
import  { join } from 'path';
import GetThemeFallbackPaths from '../../MagentoFallbackHelpers/GetThemeFallbackPaths';
import Project from '../../Models/Project';
import Theme from '../../Models/Theme';
const logger = debug('gpc:webpack:MagentoThemeFallbackResolverPlugin');

export default class MagentoThemeFallbackResolverPlugin {
    private project: Project;
    private theme: Theme;

    constructor(project: Project, theme: Theme) {
        this.project = project;
        this.theme = theme;
    }

    apply(resolver: Resolver) {
        const getThemeFallbackPaths = new GetThemeFallbackPaths();

        // @ts-ignore
        resolver.hooks.relative.tapAsync(
            'MagentoThemeFallbackResolverPlugin',
            // @ts-ignore
            async (request, stack, callback) => {
                const { handle, path } = this.validateRequest(request);

                if (!handle) {
                    return callback();
                }

                const result = await getThemeFallbackPaths.get(this.project, {
                    path,
                    theme: this.theme
                });
                let resolvedPath = path;

                // No fallbacks
                if (result.length === 0) {
                    return callback();
                } else {
                    while (result.length > 0) {
                        const fallbackData = result.shift();
                        
                        if (fallbackData) {
                            const { path: fallbackPath } = fallbackData;

                            const isResolved = await new Promise(resolve => {
                                resolver.doResolve(
                                    // @ts-ignore
                                    resolver.hooks.describedRelative,
                                    { ...request, path: fallbackPath || request.path },
                                    null,
                                    {},
                                    // @ts-ignore
                                    (err: string, data) => {
                                        if (err || !data) {
                                            resolve(false);
                                            return;
                                        }

                                        resolve(true);
                                    }
                                );
                            });

                            if (isResolved) {
                                resolvedPath = fallbackPath;
                                break;
                            }
                        }
                    }
                }

                logger(`Resolved: ${request.path} to ${resolvedPath}`);

                return resolver.doResolve(
                    // @ts-ignore
                    resolver.hooks.describedRelative,
                    { ...request, path: resolvedPath || request.path },
                    null,
                    {},
                    callback
                );
            }
        );
    }

    /**
     * Determine if this resolver should handle the given request, and return the proper request path string
     * 
     * @param request ResolveRequest
     * @returns { handle: boolean, path: string }
     */
    private validateRequest(request: ResolveRequest): { handle: boolean, path: string } {
        if (request.path) {
            if (request.path.includes(this.theme.getSourceDirectory())) {
                return {
                    handle: true,
                    path: request.path
                };
            }

            let parentTheme = this.theme.getParent();

            while (parentTheme) {
                if (request.path.includes(parentTheme.getSourceDirectory())) {
                    return {
                        handle: true,
                        path: request.path.replace(
                            parentTheme.getSourceDirectory(),
                            this.theme.getSourceDirectory()
                        )
                    };
                }

                parentTheme = parentTheme.getParent();
            }

            for (const module of this.project.getAllModules()) {
                if (request.path.includes(module.getSourceDirectory())) {
                    const paths = [
                        join(module.getSourceDirectory(), 'view', this.theme.getData().area),
                        join(module.getSourceDirectory(), 'view', 'base'),
                    ];

                    let normalizedPath = request.path;

                    for (const path of paths) {
                        normalizedPath = normalizedPath.replace(path, '');
                    }

                    return {
                        handle: true,
                        path: join(
                            this.theme.getSourceDirectory(),
                            module.getName(),
                            normalizedPath
                        )
                    };
                }
            }
        }

        return {
            handle: false,
            path: ''
        };
    }
}