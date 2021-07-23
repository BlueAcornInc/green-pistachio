## The `CriticalCSS` Configuration
Within your `green-pistachio.config.js` you'll want to configure a general hook for each theme, by default when you use
`gpc install` a base `configureTheme` tap will be created for you for each of the themes you chose to have setup, you'll also be
able to configure CriticalCSS from within the `Configure` hook, and additional `Critical CSS` hook.  Critical CSS is powered by
[Critical](https://github.com/addyosmani/critical#readme) and inherits it's options:

```javascript
project.hooks.configure.tap('Blue Acorn iCi - Green Pistachio - Configure', project => {
    project.configureTheme({
        ... Other Theme Configuration

        criticalCss: [{
            filepath: join(__dirname, 'app', 'design', 'frontend', 'BlueAcorn', 'site', 'web', 'css', 'critical.css'),
            urls: [
                'https://app.magento.test'
            ]
        }]

        ... Other Theme Configuration
    });
});

product.hooks.gulp.criticalCssConfig.tap('Green Pistachio - Critical CSS', config => {
    config.ignore = {
        atrule: ['@font-face'],
        decl: (node, value) => value.includes('https://app.magento.test')
    }
});
```

Add any of the options below to configure, you would do so by adding config.`{OptionName}` and value to the hook above, again these
are just example options from [Critical](https://github.com/addyosmani/critical#readme), it's documentation should be a more complete reference:

[comment]: # (The table below was generated here: https://www.tablesgenerator.com/markdown_tables# It can be copy pasted into this generator for easy updating in the future)

| Option | Description |
|---|---|
| `width` | Viewport Width |
| `height` | Viewport Height |
| `target` | Object that details the path and filename of target files from the base. |
| `target.css` | Name/Path of the Critical CSS file to be created. |
| `target.html` | Name/Path of the Critical CSS HTML file to be created. |
| `target.uncritical` | Name/Path of the NON-Critical CSS to be created, what's left over. |
| `base` | Your base working directory, usually Magento roots. |

[comment]: # (End Table Generator Comment)
