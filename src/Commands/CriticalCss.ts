import CriticalCssTask from '../Gulp/Tasks/CriticalCss';
import { CommandInterface, CommandOptionsInterface } from "./CommandInterface";

export interface CriticalCssCommandOptions extends CommandOptionsInterface {
    watch: boolean;
}

export default class CriticalCss implements CommandInterface {
    public async run(options: CriticalCssCommandOptions) {
        const { watch, project, theme } = options;
        const matchedTheme = project.getThemes().find(projectTheme => projectTheme.getData().path === theme);

        const criticalCss = new CriticalCssTask();
        if (watch) {
            criticalCss.watch(project, matchedTheme)(() => {});
        } else {
            criticalCss.execute(project, matchedTheme)(() => {});
        }

        return false;
    }
}
