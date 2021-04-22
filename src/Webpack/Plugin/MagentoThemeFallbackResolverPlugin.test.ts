import { ResolverFactory } from 'enhanced-resolve';
import mock from "mock-fs"
import Module from '../../Models/Module';
import Project from '../../Models/Project';
import Theme from '../../Models/Theme';
import MagentoThemeFallbackResolverPlugin from './MagentoThemeFallbackResolverPlugin';

afterEach(() => {
    mock.restore();
});

const createResolver = async () => {
    const theme = new Theme({
        sourceDirectory: `/project/path/app/design/frontend/BlueAcorn/site`,
        area: 'frontend',
        path: 'BlueAcorn/site'
    });

    const module = new Module({
        name: 'BlueAcorn_Module',
        sourceDirectory: '/project/path/app/code/BlueAcorn/Module'
    })

    const project = new Project({
        modules: [module],
        themes: [theme],
        root: '/project/path',
        includePath: ''
    });

    return ResolverFactory.createResolver({
        fileSystem: require('fs'),
        plugins: [
            new MagentoThemeFallbackResolverPlugin(project, theme)
        ]
    });
};

describe('Magento Theme Fallback Webpack Resolver Plugin', () => {
    it('should resolve physical theme files', async (done) => {
        mock({
            [`/project/path/app/design/frontend/BlueAcorn/site/web/js/some-file.js`]: 'module.exports = 42;'
        });
        
        const resolver = await createResolver();

        resolver.resolve(
            {},
            '/project/path',
            './app/design/frontend/BlueAcorn/site/web/js/some-file',
            {},
            (err, result) => {
                if (err) {
                    return done(err);
                }
                expect(result).toBe('/project/path/app/design/frontend/BlueAcorn/site/web/js/some-file.js');
                done();
            }
        );
    });

    it('should use module fallback files', async (done) => {
        mock({
            [`/project/path/app/code/BlueAcorn/Module/view/frontend/web/js/module-file.js`]: 'module.exports = "module source";'
        });
        
        const resolver = await createResolver();

        resolver.resolve(
            {},
            '/project/path',
            './app/design/frontend/BlueAcorn/site/BlueAcorn_Module/web/js/module-file',
            {},
            (err, result) => {
                if (err) {
                    return done(err);
                }
                expect(result).toBe('/project/path/app/code/BlueAcorn/Module/view/frontend/web/js/module-file.js');
                done();
            }
        );
    });

    it('should prioritize theme overrides when requesting module files', async (done) => {
        mock({
            [`/project/path/app/code/BlueAcorn/Module/view/frontend/web/js/module-file.js`]: 'module.exports = "module source";',
            [`/project/path/app/design/frontend/BlueAcorn/site/BlueAcorn_Module/web/js/module-file.js`]: 'module.exports= "theme override";'
        });

        const resolver = await createResolver();

        resolver.resolve(
            {},
            '/project/path',
            './app/code/BlueAcorn/Module/view/frontend/web/js/module-file',
            {},
            (err, result) => {
                if (err) {
                    return done(err);
                }
                expect(result).toBe('/project/path/app/design/frontend/BlueAcorn/site/BlueAcorn_Module/web/js/module-file.js');
                done();
            }
        );
    });
});