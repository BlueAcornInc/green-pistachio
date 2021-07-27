import { dest, parallel, src, TaskFunction, watch } from "gulp";
import gulpPlumber from "gulp-plumber";
import svgSprite from "gulp-svg-sprite";
import debug from 'debug';
import { join } from 'path';
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";
import { TaskInterface } from "./TaskInterface";
const logger = debug('gpc:gulp:svgSprite');

export default class SvgSprite implements TaskInterface {
    execute(project: Project): TaskFunction {
        const config = {
            svg: {
                percision: 4,
                xmlDeclaration: true,
                doctypeDeclaration: true,
                namespaceIDs: true,
                namespaceClassnames: true,
                dimensionAttributes: true
            },
            shape: {
                dest: '../src/intermediate-svg',
                spacing: {
                    padding: 0,
                    box: 'content'
                }
            },
            mode: {
                view: {
                    dest: '../css/',
                    prefix: '.svg-',
                    bust: false,
                    sprite: '../src/sprites.svg',
                    mixin: 'svg',
                    common: 'svg',
                    layout: 'vertical',
                    render: {
                        less: {
                            dest: '../css/source/blueacorn/_sprites.less',
                            template: join(__dirname, '../../../assets/tmpl/_sprite-mixins.less')
                        }
                    },
                    example: {
                        dest: '../../BlueAcorn_GreenPistachio/templates/svg_sprites.phtml',
                        template: join(__dirname, '../../../assets/tmpl/svg_sprites.phtml')
                    }
                }
            }
        };
        project.hooks.gulp.svgSpriteConfig.call(config);

        const tasks: TaskFunction[] = project.getThemes().map(theme => {
            const task: TaskFunction = done => {
                src('**/*.svg', {
                    cwd: `${theme.getSourceDirectory()}/web/spritesrc/`
                })
                    .pipe(gulpPlumber())
                    .pipe(svgSprite(config).on('error', (err) => {
                        logger
                    }))
                    .pipe(dest(`${theme.getSourceDirectory()}/web/src/`))
                    .on('end', done);
            };

            task.displayName = `svgSprite<${theme.getData().path}>`;

            return task;
        });

        return parallel(...tasks);
    }

    watch(project: Project): TaskFunction {
        return (done) => {
            watch(
                this.getSource(project.getThemes()),
                this.execute(project)
            );
        };
    }

    private getSource(themes: Theme[]): string[] {
        return themes.map(theme => `${theme.getSourceDirectory()}/web/spritesrc/**/*.svg`);
    }
}