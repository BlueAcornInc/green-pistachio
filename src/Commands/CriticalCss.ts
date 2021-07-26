import CriticalCssTask from '../Gulp/Tasks/CriticalCss';
import { CommandInterface, CommandOptionsInterface } from "./CommandInterface";

export interface CriticalCssCommandOptions extends CommandOptionsInterface {
    watch: boolean;
}

export default class CriticalCss implements CommandInterface {
    public async run(options: CriticalCssCommandOptions) {
        const { watch, project } = options;

        const criticalCss = new CriticalCssTask();
        if (watch) {
            criticalCss.watch(project)(() => {});
        } else {
            criticalCss.execute(project)(() => {});
        }

        return false;
    }
}
