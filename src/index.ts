import yargs, { Argv } from "yargs";
import { Application } from "./Application";
import CriticalCss, { CriticalCssCommandOptions } from "./Commands/CriticalCss";
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
}];

for (const gulpCommand of gulpCommands) {
    require('yargs')
        .command(`${gulpCommand.name} [theme] [vendor]`, gulpCommand.label, (yargs: GulpCommandOptions & Argv) => {
            yargs.positional('theme', {
                describe: 'single theme to compile',
                type: 'string'
            });
            yargs.positional('includePath', {
                describe: 'include vendor modules and themes',
                type: 'string',
                default: 'app'
            })
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
        yargs.default('installBaseTheme', true);
        yargs.default('baseThemeUrl', 'git@github.com:BlueAcornInc/ba-green-pistachio-theme-m2.git')
        yargs.string('baseThemeUrl');
        yargs.boolean('installBaseTheme');
    }, async (yargs: InstallCommandOptions) => {
        const app = new Application();
        const installCommand = new Install();
        await app.run(installCommand, yargs);
    })
    .command('criticalPath [theme]', 'Generate Critical CSS Files', (yargs: CriticalCssCommandOptions & Argv) => {
        yargs.positional('theme', {
            describe: 'single theme to compile',
            type: 'string'
        });
        yargs.default('watch', false);
        yargs.boolean('watch');
    }, async (yargs: CriticalCssCommandOptions) => {
        const app = new Application();
        const criticalCssCommand = new CriticalCss();
        await app.run(criticalCssCommand, yargs);
    });

yargs.demandCommand(1, '').argv;