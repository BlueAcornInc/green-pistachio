## The `Typescript` Configuration

Within your `green-pistachio.config.js` you'll be able to configure Babel Typescript from within the`Babel Typescript` hook.  Babel for Green Pistachio is powered by [gulp-babel](https://github.com/babel/gulp-babel) and available options can be viewed in the original Babel [documentation](https://babeljs.io/docs/en/options) there.  Babel Typescript follows all the same options as [Babel Configuration](#babel-config) but are separated out into their own group of configs and it's own hook:

```javascript
project.hooks.gulp.babelTypeScriptConfig.tap('Green Pistachio - Babel Typescript', config => {
    config.presets = [
        ['babel-preset-react-app', {
            helpers: false
        }]
    ];

    config.babelrc = false;
});
```

Add any of the options below to configure, you would do so by adding config.`{OptionName}` and value to the hook above, again these
are just example options from [gulp-babel](https://github.com/babel/gulp-babel), it's [documentation](https://babeljs.io/docs/en/options) should be a more complete reference:

[comment]: # (The table below was generated here: https://www.tablesgenerator.com/markdown_tables# It can be copy pasted into this generator for easy updating in the future)

| Option | Description |
|---|---|
| `cwd` | The working directory that all paths in the programmatic options will be resolved relative to. |
| `babelrc` | A babelrc value passed in the programmatic options will override one set within a configuration file. |
| `presets` | An array of presets to activate when processing this file. For more information on how individual entries interact, especially when used across multiple nested "env" and "overrides" configs. |

[comment]: # (End Table Generator Comment)
