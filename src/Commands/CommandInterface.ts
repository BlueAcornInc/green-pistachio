import Project from "../Models/Project";

export interface CommandOptionsInterface {
    project: Project;
}

export interface CommandInterface {
    run(config: CommandOptionsInterface): Promise<boolean>; 
}

export enum GulpCommands {
    DEFAULT = 'default',
    LINT = 'lint',
    WATCH = 'watch',
    COMPILE = 'compile',
}

export interface GulpCommandOptions extends CommandOptionsInterface {
    _: GulpCommands;
}

export enum WebpackCommands {
    WEBPACK = 'webpack',
    WEBPACK_BUILD = 'webpack:build',
}

export interface WebpackCommandOptions extends CommandOptionsInterface {
    _: WebpackCommands;
}

export interface InstallCommandOptions extends CommandOptionsInterface {
    installBaseTheme: boolean;
    baseThemeUrl: string;
}
