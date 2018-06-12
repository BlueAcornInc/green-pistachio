<!--
/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     2.0.1
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */
-->
<p align="center"><img src="blueacornui/images/logo.png" width="220" height="46" alt="Blue Acorn" align="center" /></p>

<h1 align="center">Grunt Workflow for <img src="blueacornui/images/magento-logo.png" width="160" height="46" alt="Magento" valign="middle" /> 2</h1>


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

From the root Magento 2 installation directory, run the following commands to install Green Pistachio 2 with Modman:

```bash
$: modman init
$: modman clone git@github.com:BlueAcornInc/green-pistachio-2.git
$: modman deploy --copy green-pistachio-2 --force
```

Install your node dependencies:

```bash
$: npm install
```

# Grunt Workflow usage

To learn more about using the Blue Acorn Grunt workflow, refer to the following [README](blueacornui/README.md)
