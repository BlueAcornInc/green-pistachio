import yargs, { Argv } from "yargs";
import { Application } from "./Application";
import Install, { InstallCommandOptions } from "./Commands/Install";
import GulpRunner, { GulpCommands, GulpCommandOptions } from "./Commands/GulpRunner";

const gulpCommands = [{
    name: GulpCommands.COMPILE,
    label: 'Compile Command',
}, {
    name: GulpCommands.DEFAULT,
    label: 'Default Command',
}, {
    name: GulpCommands.LINT,
    label: 'Lint Command',
}, {
    name: GulpCommands.WATCH,
    label: 'Watch Command'
}, {
    name: GulpCommands.WEBPACK,
    label: 'Webpack Command'
}, {
    name: GulpCommands.WEBPACK_BUILD,
    label: 'Webpack Build Command'
}];

for (const gulpCommand of gulpCommands) {
    require('yargs')
        .command(gulpCommand.name, gulpCommand.label, (yargs: GulpCommandOptions & Argv) => {
            yargs.describe('themes', 'list of themes to execute against')
            yargs.array('themes');
        }, async (yargs: GulpCommandOptions) => {
            const app = new Application();
            const gulpRunner = new GulpRunner();
            await app.run(gulpRunner, {
                ...yargs,
                command: gulpCommand.name
            })
        });
}

require('yargs')
    .command('install', 'Install Command', (yargs: InstallCommandOptions & Argv) => {
        yargs.default('installBaseTheme', false);
        yargs.default('baseThemeUrl', 'git@github.com:BlueAcornInc/ba-green-pistachio-theme-m2.git')
        yargs.string('baseThemeUrl');
        yargs.boolean('installBaseTheme');
    }, async (yargs: InstallCommandOptions) => {
        const app = new Application();
        const installCommand = new Install();
        await app.run(installCommand, yargs);
    });

yargs.demandCommand(1, '').argv;
