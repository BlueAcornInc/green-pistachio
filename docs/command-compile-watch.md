# Compile & Watch Command

This command should be run at least once, as it will clean out some files you may not need and symlink your theme files to pub/static.

```
gpc default
```

Runs the following commands:

1. Clean JS & Clean All cleans out several pub/static directories for compiled content in parallel.
2. SVG Sprite & PNG Sprite generation in parallel for active themes.
3. Image Minifaction & ESLint for active themes, and ESLint for `app/code` in parallel.
4. Babel for active themes, and Babel for modules `app/code` in parallel.
5. Executes Source Theme Deploy for active themes (based on your `gulp-config.js`)
6. Less Compilation for active themes.
7. Finally, it runs all the Watch Tasks listed out [here](command-watch.md)

## Options

Specific themes can be passed to the `--themes` argument to only run green pistachio on the themes listed. This setting will override any other enabled theme options configured in the `green-pistachio.config.js` file.

e.g., `gpc default --themes BlueAcorn/site Magento/backend`
e.g., `gpc default --themes BlueAcorn/site --themes Magento/backend`

```shell
gpc default

Default Command

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --themes   list of themes to execute against                           [array]
```