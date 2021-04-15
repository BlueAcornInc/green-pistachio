import { Resolver } from 'enhanced-resolve';
import debug from 'debug';
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
                const result = await getThemeFallbackPaths.get(this.project, {
                    path: request.path,
                    theme: this.theme
                });
                let resolvedPath = request.path;

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
}