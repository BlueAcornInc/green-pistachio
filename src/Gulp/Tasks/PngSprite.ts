import { dest, parallel, src, TaskFunction, watch } from "gulp";
import spriteSmith from 'gulp.spritesmith';
import { join } from 'path';
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";
import { TaskInterface } from "./TaskInterface";

export default class PngSprite implements TaskInterface {
    execute(project: Project) {
        const config = {
            cssName: 'web/css/source/blueacorn/_png-sprites.less',
            imgName: 'spritesheet.png',
            imgPath: 'web/src/',
            cssTemplate: join(__dirname, '../../../assets/tmpl/_png-sprite-mixins.less')
        };
        project.hooks.gulp.pngSpriteConfig.call(config);

        const tasks: TaskFunction[] = project.getThemes().map(theme => {
            const task: TaskFunction = (done) => {
                src(this.getSources([theme]))
                    .pipe(spriteSmith(config))
                    .pipe(dest(theme.getSourceDirectory()))
                    .on('end', done);
            };

            task.displayName = `pngSprite<${theme.getData().path}>`;

            return task;
        });

        return parallel(...tasks);
    }
    
    watch(project: Project): TaskFunction {
        return (done) => {
            watch(
                this.getSources(project.getThemes()),
                this.execute(project)
            );
        };
    }

    private getSources(themes: Theme[]): string[] {
        return themes.map(theme => `${theme.getSourceDirectory()}/web/spritesrc/**/*.png`);
    }
}