import { src, dest, parallel, watch, TaskFunction } from "gulp";
import debug from "debug";
import svgmin from "gulp-svgmin";
import { join } from "path";
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";
import { TaskInterface } from "./TaskInterface";
const logger = debug("gpc:gulp:svgmin");
import taskName from "./Decorators/TaskNameDecorator";

@taskName("svgmin")
export default class SvgMinGulpTask implements TaskInterface {
    execute(project: Project) {
        const tasks: TaskFunction[] = project.getThemes().map((theme) => {
            const task: TaskFunction = (done) => {
                const svgMinPaths = `${this.getImageMinSourceDirectory(
                    theme
                )}/**/*.svg`;

                logger(`Paths: ${svgMinPaths}`);

                src(svgMinPaths)
                    .pipe(svgmin())
                    .pipe(
                        dest(join(theme.getSourceDirectory(), "web", "images"))
                    )
                    .on("end", () => done());
            };

            task.displayName = `svgmin<${theme.getData().path}>`;

            return task;
        });

        if (tasks.length === 0) {
            logger(`No Svgmin tasks configured`);
            tasks.push((done) => done());
        }

        return parallel(...tasks);
    }

    watch(project: Project): TaskFunction {
        return (done) => {
            watch(
                project
                    .getThemes()
                    .map((theme) => this.getImageMinSourceDirectory(theme)),
                this.execute(project)
            );
        };
    }

    private getImageMinSourceDirectory(theme: Theme): string {
        return join(theme.getSourceDirectory(), "web", "src");
    }
}
