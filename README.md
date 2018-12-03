<!--
/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     2.0.1
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */
-->
<p align="center"><img src=".readme/logo.png" width="220" height="46" alt="Blue Acorn" align="center" /></p>

<br/>

<h1 align="center"><img src=".readme/gp-logo.png" width="220" height="38" alt="Green Pistachio" valign="middle" /> <br>Gulp Workflow for <img src=".readme/magento-logo.png" width="160" height="46" alt="Magento" valign="middle" /> 2</h1>


### Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Grunt Workflow Usage](#grunt-workflow-usage)

# Requirements

To begin installation, you will need to have the following tools installed first.

* [modman](https://github.com/colinmollenhour/modman)
* [node](https://nodejs.org/en/)
* [grunt](https://gruntjs.com/)

# Installation

Once you've met the [requirements](#requirements), you may proceed with the installation.  

1. From the root Magento 2 installation directory, run the following commands to install Green Pistachio 2 with Modman:

        $: modman init
        $: modman clone git@github.com:BlueAcornInc/green-pistachio-2.git -b 'gulp'
        $: modman deploy --copy green-pistachio-2 --force

2. Update your `_theme.js` file to point to your theme to compile, see: [additional readme](blueacornui/README.md).

3. Copy `source-example.js` to your theme's web dir (if your Vendor & Theme are not BlueAcorn/site):
`app/design/frontend/BlueAcorn/site/web/js/source/source-example.js` copy to `app/design/frontend/<VENDOR>/<THEME>/web/js/source/source-example.js`

4. Install your node dependencies:

		$: npm install

# Gulp Workflow usage

To learn more about using the Blue Acorn Gulp workflow, refer to the following [README](blueacornui/README.md)
