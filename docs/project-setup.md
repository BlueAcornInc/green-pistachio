# Project Setup

Once Green Pistachio is [installed](installation.md), we need to initialize a project.

1. Navigate to the root directory of a magento instance
2. Run `gpc` for a list of commands

If there is no `gulp-config.js` file present, Green Pistachio will provide an `install` command
which will initialize the `gulp-config.js` file for you.

```
Usage: gpc [options] [command]

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  install         installs green-pistachio build tools
  help [command]  display help for command
```

3. Run `gpc install` to initialize the project

```
collecting installed themes
? Which themes should we generate configurations for? (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ frontend/BlueAcorn/site
 ◯ adminhtml/Magento/backend
 ◯ frontend/Magento/blank
 ◯ frontend/Magento/luma
```

Here we can select which themes we want to compile using Green Pistachio, follow the toggles to make a selection

> Note: If the BlueAcorn/site theme is not available, a prompt will display asking if you wish to install the 
BlueAcorn base theme. This is not currently open source and will likely be adjusted in the future. For now, 
you would say no, or the command will end up failing.

Next, Green Pistachio will detect whether the current project has the [mage2tv/magento-cache-clean](https://github.com/mage2tv/magento-cache-clean)
installed. If it does not, it will attempt to install it for you.

4. The project is ready, you should now have a `gulp-config.js` file which will tell Green Pistachio how to work 
with your themes. Next, [read about how to adjust the config file](gulp-config.md).
