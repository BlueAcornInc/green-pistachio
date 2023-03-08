import yargs, { Argv } from "yargs";
import { Application } from "./Application";
import {
    GulpCommandOptions,
    GulpCommands,
    WebpackCommands,
    InstallCommandOptions,
    WebpackCommandOptions,
} from "./Commands/CommandInterface";

const gulpCommands = [
    {
        name: GulpCommands.COMPILE,
        label: "Compile Command",
    },
    {
        name: GulpCommands.DEFAULT,
        label: "Default Command",
    },
    {
        name: GulpCommands.LINT,
        label: "Lint Command",
    },
    {
        name: GulpCommands.WATCH,
        label: "Watch Command",
    },
];

for (const gulpCommand of gulpCommands) {
    yargs.command<GulpCommandOptions>(
        gulpCommand.name,
        gulpCommand.label,
        (yargs: Argv): Argv<GulpCommandOptions> => {
            yargs.describe("themes", "list of themes to execute against");
            yargs.array("themes");
            return yargs as Argv<GulpCommandOptions>;
        },
        async (yargs: GulpCommandOptions) => {
            const app = new Application();
            const { default: GulpRunner } = require("./Commands/GulpRunner");
            const command = new GulpRunner();
            await app.run(command, yargs);
        },
    );
}

const webpackCommands = [
    {
        name: WebpackCommands.WEBPACK,
        label: "Webpack Command",
    },
    {
        name: WebpackCommands.WEBPACK_BUILD,
        label: "Webpack Build Command",
    },
];

for (const webpackCommand of webpackCommands) {
    yargs.command<WebpackCommandOptions>(
        webpackCommand.name,
        webpackCommand.label,
        (yargs: Argv): Argv<WebpackCommandOptions> => {
            yargs.describe("themes", "list of themes to execute against");
            yargs.array("themes");
            return yargs as Argv<WebpackCommandOptions>;
        },
        async (yargs: WebpackCommandOptions) => {
            const app = new Application();
            const {
                default: WebpackRunner,
            } = require("./Commands/WebpackRunner");
            const command = new WebpackRunner();
            await app.run(command, yargs);
        },
    );
}

yargs.command<InstallCommandOptions>(
    "install",
    "Install Command",
    (yargs: Argv): Argv<InstallCommandOptions> => {
        yargs.default("installBaseTheme", false);
        yargs.default(
            "baseThemeUrl",
            "git@github.com:BlueAcornInc/ba-green-pistachio-theme-m2.git"
        );
        yargs.string("baseThemeUrl");
        yargs.boolean("installBaseTheme");
        return yargs as Argv<InstallCommandOptions>;
    },
    async (yargs: InstallCommandOptions) => {
        const app = new Application();
        const { default: Install } = require("./Commands/Install");
        const command = new Install();
        await app.run(command, yargs);
    },
);

yargs.demandCommand(1, "").argv;
