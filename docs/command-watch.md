# Watch Only Command

```
gpc watch
```

Runs the following commands:

1. Less Compilation for active themes.
2. Runs the following commands in parallel:
    1. `watchLess` - LESS files that exist in `app/design/frontend/Vendor/theme` & `app/code` and compiles them if there are changes.
    2. `watchSvgSprites` - SVG files that are added to `app/design/frontend/Vendor/theme/web/spritesrc/` are compiled into the associated spritesheet and LESS partial.
    3. `watchPngSprites` - PNG files that are added to `app/design/frontend/Vendor/theme/web/spritesrc/` are compiled into the associated spritesheet and LESS partial.
    4. `watchImages` - Images that are added to `app/design/frontend/Vendor/theme/web/src/` will be minified and moved to `app/design/frontend/Vendor/theme/web/images`.
    5. `watchJs` - JS files that exist within source directories in `app/design/frontend/Vendor/theme/` will be compiled using babel.
    6. `watchAppJs` - JS files that exist within source directories in `app/code/` modules will be compiled using babel.
    7. `watchLivereload` - Watches for CSS file changes in your theme in `pub/static` and pushes them to the browser via Live Reload.
    8. `watchCache` - Runs the amazing [mage2tv/cache-clean](https://github.com/mage2tv/magento-cache-clean) by Vinai Kopp, and watches for changes throughout Magento and clears only the appropriate caches when needed.

## Options

Specific themes can be passed to the `--themes` argument to only run green pistachio on the themes listed. This setting will override any other enabled theme options configured in the `green-pistachio.config.js` file.

e.g., `gpc watch --themes BlueAcorn/site Magento/backend`
e.g., `gpc watch --themes BlueAcorn/site --themes Magento/backend`

```shell
gpc watch

Watch Command

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --themes   list of themes to execute against                           [array]
```