import yargs, { Argv } from "yargs";
import { Application } from "./Application";
import { GulpCommandOptions, GulpCommands, WebpackCommands, InstallCommandOptions, WebpackCommandOptions } from "./Commands/CommandInterface";

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
    label: 'Watch Command',
}];

for (const gulpCommand of gulpCommands) {
    yargs.command<GulpCommandOptions>({
        command: gulpCommand.name,
        describe: gulpCommand.label,
        builder: (yargs: Argv): Argv<GulpCommandOptions> => {
            yargs.describe('themes', 'list of themes to execute against')
            yargs.array('themes');
            return yargs as Argv<GulpCommandOptions>;
        },
        handler: async (yargs: GulpCommandOptions) => {
            const app = new Application();
            const {default: GulpRunner} = require('./Commands/GulpRunner');
            const command = new GulpRunner();
            await app.run(command, yargs);
        }
    });
}

const webpackCommands = [{
    name: WebpackCommands.WEBPACK,
    label: 'Webpack Command',
}, {
    name: WebpackCommands.WEBPACK_BUILD,
    label: 'Webpack Build Command',
}];

for (const webpackCommand of webpackCommands) {
    yargs.command<WebpackCommandOptions>({
        command: webpackCommand.name,
        describe: webpackCommand.label,
        builder: (yargs: Argv): Argv<WebpackCommandOptions> => {
            yargs.describe('themes', 'list of themes to execute against')
            yargs.array('themes');
            return yargs as Argv<WebpackCommandOptions>;
        },
        handler: async (yargs: WebpackCommandOptions) => {
            const app = new Application();
            const {default: WebpackRunner} = require('./Commands/WebpackRunner');
            const command = new WebpackRunner();
            await app.run(command, yargs);
        }
    });
}

yargs.command<InstallCommandOptions>({
    command: 'install',
    describe: 'Install Command',
    builder: (yargs: Argv): Argv<InstallCommandOptions> => {
        yargs.default('installBaseTheme', false);
        yargs.default('baseThemeUrl', 'git@github.com:BlueAcornInc/ba-green-pistachio-theme-m2.git')
        yargs.string('baseThemeUrl');
        yargs.boolean('installBaseTheme');
        return yargs as Argv<InstallCommandOptions>;
    },
    handler: async (yargs: InstallCommandOptions) => {
        const app = new Application();
        const {default: Install} = require('./Commands/Install');
        const command = new Install();
        await app.run(command, yargs);
    }
});

yargs.demandCommand(1, '').argv;
