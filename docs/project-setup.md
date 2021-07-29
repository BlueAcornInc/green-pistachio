# Project Setup

Once Green Pistachio is [installed](installation.md), we need to initialize a project.

1. Navigate to the root directory of a magento instance
2. Run `gpc` for a list of commands (Or `npm run gpc` if you're working off scripts declared in your `package.json` instead).
3. Run `gpc install` to install all dependencies required. See the available options below.

```shell
gpc install

Install Command

Options:
  --help              Show help                                        [boolean]
  --version           Show version number                              [boolean]
  --installBaseTheme                                  [boolean] [default: false]
  --baseThemeUrl                                              [string] [default:
                  "git@github.com:BlueAcornInc/ba-green-pistachio-theme-m2.git"]
```

## What's going on?

The `gpc install` command creates the necessary configuration files within your project and installs some mandatory dependencies.

1. installation command will generate a default `tsconfig.json` file to compile typescript into javascript with babel and webpack.

2. If you provide a theme URL and toggle the `--installBaseTheme` command, the installation command will attempt to clone the theme repository into your project.

3. Green Pistachio will install the [mage2tv/magento-cache-clean](https://github.com/mage2tv/magento-cache-clean) composer module to handle cache cleaning tasks.

4. Green Pistachio will generate a default `green-pistachio.config.js` file for you in your project root, where you can fine-tune different configuration settings.

5. The project is ready, you should now have a `green-pistachio.config.js` file which will tell Green Pistachio how to work
with your themes. Next, [read about how to adjust the config file](green-pistachio-config.md).
