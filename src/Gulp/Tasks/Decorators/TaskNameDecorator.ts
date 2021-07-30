import {TaskInterface} from "../TaskInterface";
import {TaskFunction} from "gulp";
import Project from "../../../Models/Project";

export default function taskName(displayName: string) {
    return function taskNameDecorator<T extends { new (...args: any[]): TaskInterface }>(TargetClass: T) {
        return class extends TargetClass {
            execute(project: Project): TaskFunction {
                const task = super.execute(project);

                task.displayName = displayName;

                return task;
            }

            watch(project: Project): TaskFunction {
                const task = super.watch(project);

                task.displayName = `watch<${displayName}>`;

                return task;
            }
        }
    };
}
