import { promises as fs } from 'fs';
import { join } from 'path';
import debug from 'debug';
import glob from 'fast-glob';
import Project from "../Project";
const logger = debug('gpc:configLoader');

export default class ConfigLoader {
    public static CONFIG_FILE = 'green-pistachio.config.js';

    constructor(private project: Project) {}

    get filePath(): string {
        return join(
            this.project.getRootDirectory(),
            ConfigLoader.CONFIG_FILE
        );
    }

    public async configExists(): Promise<boolean> {
        try {
            const configExists = await fs.stat(this.filePath);

            if (configExists) {
                return true;
            }
        } catch (err) {
            logger(`Config file can't be found at ${this.filePath}`);
        }

        return false;
    }

    public async loadConfig() {
        const configExists = await this.configExists();

        if (configExists) {
            try {
                this.interopRequire()(this.project);
            } catch (err) {
                logger(`Problem occurred while running user provided configuration file: ${err}`);
            }
        }

        await this.loadModularConfigFiles();
    }

    private async loadModularConfigFiles() {
        const filePaths = [
            ...this.project.getAllModules(),
            ...this.project.getAllThemes()
        ].map(compilableObject =>
            join(
                compilableObject.getSourceDirectory(),
                ConfigLoader.CONFIG_FILE
            )
        );

        const configFiles = await glob(filePaths);

        for (const configFile of configFiles) {
            try {
                this.interopRequire(configFile)(this.project);
            } catch (err) {
                logger(`Problem occurred while running user provided configuration file: ${err}`);
            }
        }
    }

    private interopRequire(filePath = '') {
        const configFile = filePath || this.filePath;
        const configModule = require(configFile);
        return configModule && configModule.__esModule ? configModule.default : configModule;
    }
}