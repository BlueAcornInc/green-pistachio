import { TaskFunction } from "gulp";
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";

export interface TaskInterface {
    execute(project: Project, theme?: Theme): TaskFunction;
    watch(project: Project, theme?: Theme): TaskFunction;
}