import { promises as fs } from 'fs';
import { join } from 'path';
import debug from 'debug';
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

    public async loadConfig(): Promise<boolean> {
        const configExists = await this.configExists();

        if (configExists) {
            try {
                this.interopRequire()(this.project);
                return true;
            } catch (err) {
                logger(`Problem occurred while running user provided configuration file: ${err}`);
            }
        }

        return false;
    }

    private interopRequire() {
        const configModule = require(this.filePath);
        return configModule && configModule.__esModule ? configModule.default : configModule;
    }
}