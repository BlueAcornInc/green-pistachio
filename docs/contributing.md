# Contributing

Noticing something strange and want to fix it? Seeing some room for improvement? The notes below will help guide you how to set up green pistachio locally for development.

## Local Project Setup

Most of the code has been developed in a way that can be updated without needing to connect directly to a Magento codebase, but it's still a good idea to test your changes against an actual Magento project.

A simple way to accomplish this will be to clone this repository into a subdirectory into your local project, then leverage yarn workspaces to link green-pistachio to the project. 

1. At Blue Acorn iCi. We're big fans of [Warden](https://warden.dev). So the first step of this process is to [spin up a new Magento project using warden](https://docs.warden.dev/environments/magento2.html).
2. Once completed, clone the Green Pistachio codebase into a directory of your project, like so: `git clone git@github.com:BlueAcornInc/green-pistachio.git green-pistachio`.
3. Now create a `package.json` file and paste the following into it:

```json
{
  "private": "true",
  "workspaces": {
    "nohoist": ["**"],
    "packages": ["green-pistachio"]
  },
  "scripts": {
    "gpc": "gpc",
    "gpc:build": "yarn workspace @blueacornici/green-pistachio prepare",
    "gpc:dev": "yarn workspace @blueacornici/green-pistachio dev",
    "gpc:test": "yarn workspace @blueacornici/green-pistachio test"
  }
}
```

4. Run `yarn` to install dependencies
5. Run `yarn gpc:build` to compile the gpc source code

At this point, you are ready to contribute to green-pistachio and test it against a new Magento project!

## Development commands

If you copied the JSON above, you'll see four different NPM scripts that can be used in your project:
* `yarn gpc`: This command will run the `gpc` CLI application in your project. You can use this to test different commands against a real Magento project.
* `yarn gpc:build`: This command will compile the green pistachio typescript source into javascript.
* `yarn gpc:dev`: This command will initialize a file watcher which will compile the source any time you make a change.
* `yarn gpc:test`: This command will run all jest tests
