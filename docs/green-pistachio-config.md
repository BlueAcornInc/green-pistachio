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

## The `configureTheme` setup
Within your `green-pistachio.config.js` you'll want to configure a general hook for each theme, by default when you use 
`gpc install` a base `configureTheme` tap will be created for you for each of the themes you chose to have setup:

```javascript
project.hooks.configure.tap('Blue Acorn iCi - Green Pistachio - Configure', project => {
    project.configureTheme({
        path: 'BlueAcorn/site'
    });
});
```

The object pass to configureTheme allows you to control information about your theme, whether or not it should be
compiled with the build tools, what locales you want to compile to in `pub/static` and what stylesheets you want to 
compile.

Add any of the options below to configure:

[comment]: # (The table below was generated here: https://www.tablesgenerator.com/markdown_tables# It can be copy pasted into this generator for easy updating in the future)

| Setting/Key | Options  | Description                                                                                                                                                                                   |
|-------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| gulp        | Boolean  | Tells tells the build tools whether or not to run for a particular theme, useful for when you want to only watch some of your themes in a multi-theme setup.                                  |
| area        | String   | Scope of the theme in the workflow, if you have a normal front-end theme, you would populate this with frontend. If you are compiling an admin theme, you would populate this with adminhtml. |
| path        | String   | Path within app/design/{appPath}/ where you wish the workflow to process                                                                                                                      |
| locales     | String[] | The locales array is a list of locales you wish to compile your theme for, by default you should have at least one, in the example above we have en_US which is the Blue Acorn iCi default.   |
| stylesheets | String[] | Array of parent stylesheets that you wish to compile from less to css. Examples: css/styles-m css/styles-l Vendor_Module::css/styles                                                          |
| crticalCss  | Object[] | Array of Objects containing information to compile CriticalCSS, covered in the [CriticalCSS Documentation](critical-css.md)                                                                   | |

[comment]: # (End Table Generator Comment)
