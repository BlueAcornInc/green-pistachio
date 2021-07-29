import { dest, parallel, src, TaskFunction, watch } from "gulp";
import glob from 'fast-glob';
import gulpPlumber from "gulp-plumber";
import svgSprite from "gulp-svg-sprite";
import debug from 'debug';
import { join, relative, dirname, basename } from 'path';
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
                        dest: '../../Magento_Theme/templates/framework/sprites.phtml',
                        template: join(__dirname, '../../../assets/tmpl/svg_sprites.phtml')
                    }
                }
            }
        };
        project.hooks.gulp.svgSpriteConfig.call(config);

        const tasks: TaskFunction[] = project.getThemes().map(theme => {
            const task: TaskFunction = done => {
                this.getSpriteFiles(theme).then(files => {
                    src(files, {
                        cwd: join(
                            theme.getSourceDirectory(),
                            'web',
                            'spritesrc'
                        )
                    })
                        .pipe(gulpPlumber())
                        .pipe(svgSprite(config).on('error', (err) => {
                            logger
                        }))
                        .pipe(dest(`${theme.getSourceDirectory()}/web/src/`))
                        .on('end', done);
                });
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

    private async getSpriteFiles(targetTheme: Theme): Promise<string[]> {
        const svgMap: Map<string, string> = new Map();
        const targetPath = join(
            targetTheme.getSourceDirectory(),
            'web',
            'spritesrc'
        );

        // Invert themes, further in the array, the higher priority
        const themes: Theme[] = [targetTheme];
        let parentTheme = targetTheme.getParent();
        while (parentTheme) {
            themes.unshift(parentTheme);
            parentTheme = parentTheme.getParent();
        }

        // Find all svgs
        const allSvgFiles = await Promise.all(
            themes.map(async theme => {
                const files = await glob(
                    join(
                        theme.getSourceDirectory(),
                        '/web/spritesrc/**/*.svg',
                    )
                );

                return {
                    theme,
                    files
                };
            })
        );

        for (const { theme, files } of allSvgFiles) {
            for (const svgFile of files) {
                const normalizedFile = svgFile.replace(
                    join(
                        theme.getSourceDirectory(),
                        'web',
                        'spritesrc'
                    ),
                    ''
                );
                const svgFileDir = dirname(svgFile);
                const svgFileName = basename(svgFile);
                const relativePath = relative(targetPath, svgFileDir);

                svgMap.set(normalizedFile, join(
                    relativePath,
                    svgFileName
                ));
            }
        }

        return Array.from(svgMap.values());
    }
}