import { src, TaskFunction, watch, dest } from "gulp";
import { join } from 'path';
import Module from "../../Models/Module";
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";

export interface TaskData {
    sources: string[];
    outputDirectory: string;
}

export default abstract class AbstractJsTask {
    protected MODULE_GLOB: string = '';
    protected THEME_GLOB: string = '';
    protected TASK_NAME: string = '';

    execute(project: Project): TaskFunction {
        if (!process.env.BABEL_ENV) {
            process.env.BABEL_ENV = 'development';
        }

        const taskData = this.getTaskData(project);

        return (done) => {
            const gulpStream = src(taskData.sources, {
                allowEmpty: true,
                cwdbase: true
            });

            this.getTask(project, gulpStream)
                .pipe(dest(taskData.outputDirectory))
                .on('finish', done);
        };
    }

    watch(project: Project): TaskFunction {
        const paths = this.getTaskData(project).sources;

        return (done) => {
            watch(
                paths,
                this.execute(project)
            );
        };
    }

    protected getTaskData(project: Project) {
        const compilableObjects = ([] as (Theme | Module)[])
            .concat(project.getThemes())
            .concat(project.getModules());

        return compilableObjects.reduce<TaskData>((memo, compilableObject) => ({
            ...memo,
            sources: [
                ...memo.sources,
                join(
                    compilableObject.getSourceDirectory(),
                    compilableObject instanceof Theme ? this.THEME_GLOB : this.MODULE_GLOB
                )
            ]
        }), {
            sources: [],
            outputDirectory: project.getRootDirectory()
        });
    }

    abstract getTask(
        project: Project,
        gulpStream: NodeJS.ReadWriteStream
    ): NodeJS.ReadWriteStream;
}
