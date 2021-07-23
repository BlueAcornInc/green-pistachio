## The `ESLint` Configuration
Within your `green-pistachio.config.js` you'll be able to configure ESLint from within the`ESLint` hook.  ESLint for Green Pistachio is powered by [gulp-eslint](https://github.com/adametry/gulp-eslint#readme) and options can be viewed there:

```javascript
product.hooks.gulp.eslintConfig.tap('Green Pistachio - ESLint', config => {
    config.configFile = './.eslintrc-project`
});
```

Add any of the options below to configure, you would do so by adding config.`{OptionName}` and value to the hook above, again these
are just example options from [gulp-eslint](https://github.com/adametry/gulp-eslint#readme), it's documentation should be a more complete reference:

[comment]: # (The table below was generated here: https://www.tablesgenerator.com/markdown_tables# It can be copy pasted into this generator for easy updating in the future)

| Option | Description |
|---|---|
| `configFile` | Path to the ESLint rules configuration file. |
| `envs` | Specify a list of [environments](https://eslint.org/docs/user-guide/configuring/#specifying-environments) to be applied. |
| `rulePaths` | This option allows you to specify additional directories from which to load rules files. This is useful when you have custom rules that aren't suitable for being bundled with ESLint |
| `fix` | This option instructs ESLint to try to fix as many issues as possible. The fixes are applied to the gulp stream. |
| `global` | Specify global variables to declare. |
| `warnFileIgnored` | When true, add a result warning when ESLint ignores a file. This can be used to file files that are needlessly being loaded by gulp.src. For example, since ESLint automatically ignores "node_modules" file paths and gulp.src does not, a gulp task may take seconds longer just reading files from the "node_modules" directory. |

[comment]: # (End Table Generator Comment)
