import { parallel, TaskFunction, watch } from "gulp";
import Module from "../../Models/Module";
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";
import TaskDataProvider, { TaskData } from "../JsFileGlobs";

export default abstract class AbstractJsTask {
    protected taskDataProvider: TaskDataProvider;
    protected MODULE_GLOB: string = '';
    protected THEME_GLOB: string = '';

    constructor() {
        this.taskDataProvider = new TaskDataProvider();
    }

    execute(project: Project, theme?: Theme): TaskFunction {
        if (!process.env.BABEL_ENV) {
            process.env.BABEL_ENV = 'development';
        }

        const tasks: TaskFunction[] = this.taskDataProvider.getTasksData({
            project,
            theme,
            moduleGlob: this.MODULE_GLOB,
            themeGlob: this.THEME_GLOB,
            getName: this.getName
        }).map(this.getTask.bind(this));

        if (tasks.length === 0) {
            return (done) => done();
        }

        return parallel(...tasks);
    }

    watch(project: Project, theme?: Theme): TaskFunction {
        const paths = this.taskDataProvider.getTasksData({
            project,
            theme,
            moduleGlob: this.MODULE_GLOB,
            themeGlob: this.THEME_GLOB,
            getName: this.getName
        }).map(({ sources }) => sources);

        return (done) => {
            watch(
                paths,
                this.execute(project, theme)
            );
        };
    }

    abstract getName(source: Theme | Module): string;

    abstract getTask(taskData: TaskData): TaskFunction;
}