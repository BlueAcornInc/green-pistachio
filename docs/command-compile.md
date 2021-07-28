# Compile Only Command

```
gpc compile
```

Runs the following commands:

1. SVG Sprite & PNG Sprite generation in parallel for active themes.
2. Image Minifaction & ESLint for active themes, and ESLint for `app/code` in parallel.
3. Babel for active themes, and Babel for modules `app/code` in parallel.
4. Less Compilation for active themes.

## Options

Specific themes can be passed to the `--themes` argument to only run green pistachio on the themes listed. This setting will override any other enabled theme options configured in the `green-pistachio.config.js` file.

e.g., `gpc compile --themes BlueAcorn/site Magento/backend`
e.g., `gpc compile --themes BlueAcorn/site --themes Magento/backend`

```shell
gpc compile

Compile Command

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --themes   list of themes to execute against                           [array]
```