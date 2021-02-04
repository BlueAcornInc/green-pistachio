import { CommandInterface, CommandOptionsInterface } from "./CommandInterface";
import GulpRunner from "./Runners/GulpRunner";

export interface CompileCommandOptions extends CommandOptionsInterface {}

export default class Default implements CommandInterface {
    public async run(options: CompileCommandOptions) {
        const { project, theme } = options;
        const matchedTheme = project.getThemes().find(projectTheme => projectTheme.getData().path === theme);

        const gulpRunner = new GulpRunner();
        gulpRunner.compile(project, matchedTheme)(() => {});

        return false;
    }
}