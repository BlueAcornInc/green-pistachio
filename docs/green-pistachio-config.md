# Gulp Config

The `green-pisatchio.config.js` file informs Green Pistachio on the specifics of your
project. Within the file, you will find an object of [webpack/tapable](https://github.com/webpack/tapable) taps, some of which are automatically populated for you on `gpc install` [Project Setup](project-setup.md)

Example:

```javascript
const { join } = require('path');

module.exports = project => {
    project.hooks.configure.tap('Green Pistachio - Configure', project => {
        project.configureTheme({
            path: 'BlueAcorn/site',

            // By default Green Pistachio will gather styles from your theme's web/ directory that don't begin with _
            // and add them to an array to compile, but if you need to compile module specific CSS files you must
            // declare them in a tapable hook like so:
            stylesheets: [
                'css/styles-m',
                'css/styles-l',
                'BlueAcorn_CmsFramework::css/grid'
            ],

            criticalCss: [{
                filepath: join(__dirname, 'app', 'design', 'frontend', 'BlueAcorn', 'site', 'web', 'css', 'critical.css'),
                urls: [
                    'https://app.magento.test',
                ]
            }]
        });

        // By default Green Pistachio will compile all modules, except for those in the vendor directory.
        // If you need to compile code in vendor (not recommended), you can enable the module like so:
        project.enableModule("BlueAcorn_CmsFramework");
    });

    project.hooks.gulp.criticalCssConfig.tap('Green Pistachio - Critical CSS', config => {
        config.ignore = {
            atrule: ['@font-face'],
            decl: (node, value) => value.includes('https://app.magento.test')
        }
    });

    project.hooks.gulp.svgSpriteConfig.tap('Green Pistachio  - Svg Sprite', config => {
        config.shape.spacing = {
            padding: 5,
            box: 'padding'
        };

        config.mode.view.render.less = {
            dest: '../css/source/blueacorn/_sprites.less',
            template: join(__dirname, 'blueacornui', 'assets', 'tmpl', '_sprite-mixins.less')
        };

        config.mode.view.example = {
            dest: '../../BlueAcorn_CmsFramework/templates/framework/sprites.phtml',
            template: join(__dirname, 'blueacornui', 'assets', 'tmpl', 'svg_sprites.phtml')
        };

        return config;
    });
};
```