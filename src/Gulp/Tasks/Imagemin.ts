import { src, dest, parallel, watch, TaskFunction } from "gulp";
import debug from "debug";
import squoosh from "gulp-libsquoosh";
import { join } from "path";
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";
import { TaskInterface } from "./TaskInterface";
const logger = debug("gpc:gulp:imageMin");
import taskName from "./Decorators/TaskNameDecorator";

@taskName("squoosh")
export default class ImageMinGulpTask implements TaskInterface {
    execute(project: Project) {
        const tasks: TaskFunction[] = project.getThemes().map((theme) => {
            const task: TaskFunction = (done) => {
                const imageMinPaths = `${this.getImageMinSourceDirectory(
                    theme
                )}/**/*.{png,jpg,jpeg}`; // Gifs & SVGs are not supported

                logger(`Paths: ${imageMinPaths}`);

                src(imageMinPaths)
                    .pipe(squoosh({}, {}))
                    .pipe(
                        dest(join(theme.getSourceDirectory(), "web", "images"))
                    )
                    .on("end", () => done());
            };

            task.displayName = `squoosh<${theme.getData().path}>`;

            return task;
        });

        if (tasks.length === 0) {
            logger(`No Squoosh tasks configured`);
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
