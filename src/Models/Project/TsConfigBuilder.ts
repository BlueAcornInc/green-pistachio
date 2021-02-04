import { promises as fs } from 'fs';
import { join } from 'path';
import debug from 'debug';
import Project from "../Project";
const logger = debug('gpc:typescript:configBuilder');

export default class TsConfigBuilder {
    public getFilePath(): string {
        return join(__dirname, '..', '..', '..', 'green-pistachio.tsconfig.json');
    }

    public async configFileExists(): Promise<boolean> {
        try {
            await fs.stat(this.getFilePath());

            return true;
        } catch (err) {
            return false;
        }
    }

    public async emitConfigFile(project: Project) {
        logger(`Generating Projects tsconfig.json base`);
        const include: string[] = [];
        const paths: Record<string, string[]> = {}

        for (const module of project.getModules()) {
            const moduleSrcDir = module.getSourceDirectory().replace(project.getRootDirectory(), '');

            const modulePaths: string[] = [
                join(moduleSrcDir, 'view/frontend/web/ts/*'),
                join(moduleSrcDir, 'view/base/web/ts/*'),
                join(moduleSrcDir, 'view/adminhtml/web/ts/*'),
            ];

            paths[`${module.getName()}/*`] = modulePaths.map(modulePath => modulePath.replace(/^\//, ''));

            include.push(join(moduleSrcDir, 'view/frontend/web/ts/**/*'));
            include.push(join(moduleSrcDir, 'view/base/web/ts/**/*'));
            include.push(join(moduleSrcDir, 'view/adminhtml/web/ts/**/*'));
        }

        for (const theme of project.getAllThemes()) {
            const themeSrcDir = theme.getSourceDirectory().replace(project.getRootDirectory(), '');

            include.push(join(themeSrcDir, '**/*'));
            
            // Add theme overrides to module paths
            for (const moduleName of Object.keys(paths)) {
                paths[moduleName].unshift(
                    join(themeSrcDir, moduleName.replace(/\/\*$/, ''), 'web/ts/*').replace(/^\//, '')
                );
            }
        }

        logger(`Resolved include paths to: ${JSON.stringify(include)}`);
        logger(`Resolved module paths to: ${JSON.stringify(paths)}`);

        const writePath = this.getFilePath();
        const config = this.getBaseConfig();

        config.include = include.map(includePath => `./${includePath}`);
        config.compilerOptions.paths = paths;

        try {
            logger(`Writing config file: ${writePath}`);
            await fs.writeFile(writePath, JSON.stringify(config, null, 4));
        } catch (err) {
            logger(`Problem writing config file: ${writePath}`);
            throw err;
        }

        return writePath;
    }

    private getBaseConfig() {
        return {
            "include": [
              "./app/**/*"
            ],
            "compilerOptions": {
              "baseUrl": ".",
              "paths": {},
              "strict": true,
              "esModuleInterop": true,
              "lib": [
                "dom",
                "es2015"
              ],
              "jsx": "react",
              "emitDecoratorMetadata": true,
              "experimentalDecorators": true,
              "target": "es5",
              "allowJs": true,
              "skipLibCheck": true,
              "allowSyntheticDefaultImports": true,
              "forceConsistentCasingInFileNames": true,
              "module": "esnext",
              "moduleResolution": "node",
              "resolveJsonModule": true,
              "isolatedModules": true,
              "noEmit": true
            }
          }
    }
}