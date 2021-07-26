import { join } from 'path';
import Module from "../Models/Module";
import Project from "../Models/Project";
import Theme from "../Models/Theme";

export interface TaskData {
    sources: string;
    outputDirectory: string;
    displayName: string;
    project: Project;
}

interface GetTasksDataParam {
    project: Project;
    moduleGlob: string;
    themeGlob: string;
    getName: (source: Theme | Module) => string
}

export default class TaskDataProvider {
    public getTasksData(config: GetTasksDataParam): TaskData[] {
        const {
            project,
            moduleGlob,
            themeGlob,
            getName
        } = config;

        return ([] as (Theme | Module)[])
            .concat(project.getThemes())
            .concat(project.getModules())
            .map((source) => {
                const displayName = getName(source);
                let glob = moduleGlob;

                if (source instanceof Theme) {
                    glob = themeGlob;
                }

                return {
                    sources: join(
                        source.getSourceDirectory(),
                        glob
                    ),
                    outputDirectory: source.getSourceDirectory(),
                    displayName,
                    project
                };
            })
    }
}
