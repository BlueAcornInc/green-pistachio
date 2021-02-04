import yargs, { Argv } from "yargs";
import { Application } from "./Application";
import Compile, { CompileCommandOptions } from "./Commands/Compile";
import Default, { DefaultCommandOptions } from "./Commands/Default";
import Install, { InstallCommandOptions } from "./Commands/Install";
import Watch, { WatchCommandOptions } from "./Commands/Watch";

require('yargs')
    .command('default', 'Default command', (yargs: Argv) => {}, () => {
        console.log('hello world');
    })
    .command('compile [theme] [vendor]', 'Compile Command', (yargs: CompileCommandOptions & Argv) => {
        yargs.positional('theme', {
            describe: 'single theme to compile',
            type: 'string'
        });
        yargs.positional('includePath', {
            describe: 'include vendor modules and themes',
            type: 'string',
            default: 'app'
        })
    }, async (yargs: CompileCommandOptions) => {
        const app = new Application();
        const compile = new Compile();
        await app.run(compile, yargs);
    })
    .command('watch [theme]', 'Watch Command', (yargs: WatchCommandOptions & Argv) => {
        yargs.positional('theme', {
            describe: 'single theme to compile',
            type: 'string'
        });
        yargs.positional('includePath', {
            describe: 'include vendor modules and themes',
            type: 'string',
            default: 'app'
        })
    }, async (yargs: WatchCommandOptions) => {
        const app = new Application();
        const watch = new Watch();
        await app.run(watch, yargs);
    })
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
    .command('default [theme]', 'Default Command', (yargs: DefaultCommandOptions & Argv) => {
        yargs.positional('theme', {
            describe: 'single theme to compile',
            type: 'string'
        });
        yargs.positional('includePath', {
            describe: 'include vendor modules and themes',
            type: 'string',
            default: 'app'
        })
    }, async (yargs: DefaultCommandOptions) => {
        const app = new Application();
        const defaultCommand = new Default();
        await app.run(defaultCommand, yargs);
    });

yargs.demandCommand(1, '').argv;