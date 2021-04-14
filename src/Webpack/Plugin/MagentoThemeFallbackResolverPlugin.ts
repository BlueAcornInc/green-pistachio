import { Resolver } from 'enhanced-resolve';
import debug from 'debug';
import GetThemeFallbacks from '../../MagentoFallbackHelpers/GetThemeFallbacks';
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
        const themeFallbackResolver = new GetThemeFallbacks();

        // @ts-ignore
        resolver.hooks.relative.tapAsync(
            'MagentoThemeFallbackResolverPlugin',
            // @ts-ignore
            async (request, stack, callback) => {
                const result = await themeFallbackResolver.get(this.project, {
                    filename: request.path,
                    theme: this.theme,
                    shallow: true
                });

                logger(request, result);

                if (result instanceof Array && result.length === 0) {
                    return callback();
                }

                if (result) {
                    const resultPath = result instanceof Array ? result[0].filename : result.filename;

                    return resolver.doResolve(
                        // @ts-ignore
                        resolver.hooks.describedRelative,
                        { ...request, path: resultPath || request.path },
                        null,
                        {},
                        callback
                    );         
                }

                return callback();
            }
        );
    }
}