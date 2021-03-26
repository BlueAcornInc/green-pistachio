# System Requirements

To begin the installation, you will need to have the following tools installed first on your system:

* [nodejs](https://nodejs.org/en/)

-----

# Installation

Installation can be done [globally](#install-as-a-global-utility), or on a [per-project](#install-as-a-project-dependency) basis. If you find yourself working on
multiple projects, it may make the most sense to install Green Pistachio as a dependency to your
project, so it can be updated independently.

## Install as a project dependency

Once your local magento instance is set up, perform the following:

```shell
# will create your package.json file
$ npm init -y
# will install Green pistachio and save it as a dependency to your project
$ npm install --save @blueacornici/green-pistachio
```

Open the package.json file in your favorite code editor, and add some node scripts:

```json
...
    "scripts": {
        "gpc": "gpc",
        "start": "gpc default",
        "build": "gpc compile",
        "watch": "gpc watch"
    },
...
```

These commands will expose the gulp tasks you want to perform by running:
* `npm start` compile+watcher
* `npm run build` one time compilation
* `npm run watch` starts the file watcher
* `npm run gpc` for a list of available green-pistachio commands

## Installing in Warden

If you're working with warden, you'll want to execute your `npm install` and `npm run` commands within `warden shell`

```shell
$: warden shell
www-data@gp-php-fpm:/var/www/html$ npm init -y
www-data@gp-php-fpm:/var/www/html$ npm install --save @blueacornici/green-pistachio
www-data@gp-php-fpm:/var/www/html$ npm run start
```

## Install as a global utility

Global installation can be done by running 

```shell
$ npm install -g @blueacornici/green-pistachio
```

This will expose a new command in your terminal called `gpc`
