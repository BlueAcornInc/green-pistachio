import { CommandInterface, CommandOptionsInterface } from "./CommandInterface";
import GulpRunner from "./Runners/GulpRunner";

export interface DefaultCommandOptions extends CommandOptionsInterface {}

export default class Default implements CommandInterface {
    public async run(options: DefaultCommandOptions) {
        const { project, theme } = options;
        const matchedTheme = project.getThemes().find(projectTheme => projectTheme.getData().path === theme);

        const gulpRunner = new GulpRunner();
        gulpRunner.default(project, matchedTheme)(() => {});

        return false;
    }
}