import { TaskFunction } from "gulp";
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";

export interface TaskInterface {
    execute(project: Project): TaskFunction;
    watch(project: Project): TaskFunction;
}
