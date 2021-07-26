import { resolve } from 'path';
import { userInfo } from 'os';
import { promises as fs } from 'fs';
import rimraf from 'rimraf';
import mkdirp from 'mkdirp';
import debug from 'debug';
import CommandRunner from "../CommandRunner";
import { CommandInterface, CommandOptionsInterface } from "./CommandInterface";
const logger = debug('gpc:install');

const rimrafP = async (dir: string) => new Promise(resolve => rimraf(dir, resolve));

export interface InstallCommandOptions extends CommandOptionsInterface {
    installBaseTheme: boolean;
    baseThemeUrl: string;
}

export default class Install implements CommandInterface {
    private commandRunner: CommandRunner;

    constructor() {
        this.commandRunner = new CommandRunner();
    }

    public async run(options: InstallCommandOptions) {
        debug.enable('gpc:install');
        const {
            installBaseTheme,
            baseThemeUrl,
            project
        } = options;

        await this.generateBaseTsConfig(project.getRootDirectory());
        
        if (installBaseTheme) {
            await this.installBaseTheme(project.getRootDirectory(), baseThemeUrl);
        }

        await this.installCacheClean();

        return false;
    }

    private async installBaseTheme(rootDir: string, baseThemeUrl: string) {
        const homeDir = resolve(userInfo().homedir, '.green-pistachio');
        const homeThemeDir = resolve(homeDir, 'theme');
        const appThemeDir = resolve(rootDir, 'app', 'design');
        
        await rimrafP(homeThemeDir);
        await mkdirp(homeThemeDir);
        
        try {
            logger('installing base theme');
            const { stdout } = await this.commandRunner.execute(`git clone ${baseThemeUrl} .`, {
                cwd: homeThemeDir
            });

            logger(stdout);

            await this.copyFiles(
                resolve(homeThemeDir, 'app', 'design'),
                appThemeDir
            );
        } catch (err) {
            logger(`Err: ${JSON.stringify(err)}`);
        }
    }

    private async copyFiles(source: string, destination: string) {
        await mkdirp(destination);
        const dir = await fs.readdir(source);

        await Promise.all(
            dir.map(async element => {
                const sourceFile = resolve(source, element);
                const destFile = resolve(destination, element);
                const stat = await fs.lstat(sourceFile);

                if (stat.isFile()) {
                    await fs.copyFile(sourceFile, destFile);
                } else {
                    await this.copyFiles(sourceFile, destFile);
                }
            })
        );
    }

    private async installCacheClean() {
        try {
            logger('installing cache clean');
            const { stdout } = await this.commandRunner.execute(`composer require --dev mage2tv/magento-cache-clean`);
            logger('cache clean installed');
            logger(stdout);
        } catch (err) {
            logger(`Err: ${JSON.stringify(err)}`);
        }
    }

    private async generateBaseTsConfig(projectDirectory: string) {
        const config = {
            include: ["./app/**/*.ts", "./app/**/*.tsx"],
            extends: "@blueacornici/green-pistachio/green-pistachio.tsconfig",
            compilerOptions: {
                jsx: "react",
                esModuleInterop: true,
                paths: {
                    "Magento_PageBuilder/*": ["vendor/magento/module-page-builder/view/adminhtml/web/ts/*"]
                }
            }
        };

        try {
            logger(`Writing project tsconfig file`);
            await fs.writeFile(
                resolve(projectDirectory, 'tsconfig.json'),
                JSON.stringify(config, null, 4)
            );
        } catch (err) {
            logger(`Problem writing project tsconfig file`);
        }
    }
}