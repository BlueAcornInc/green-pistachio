import { watch, TaskFunction, parallel } from "gulp";
import puppeteer from "puppeteer";
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import critical from 'critical';
import purge from 'css-purge';
import debug from 'debug';
import Project from "../../Models/Project";
import { TaskInterface } from "./TaskInterface";
import glob from "fast-glob";
const logger = debug('gpc:gulp:criticalCss');

export default class CriticalCss implements TaskInterface {
    private firstRun: boolean = true;
    private cacheMap: Map<string, boolean> = new Map();

    /**
     * Default options to be passed into the critical css node module
     */
    public static options = {
        dimensions: [
            {
                width: 375,
                height: 900
            },
            {
                width: 1440,
                height: 1080
            }
        ],
        minify: true
    };

    /**
     * Creates a critical.css file by project configuration
     * 
     * @param project | Project
     * @param theme | Theme
     * @returns TaskFunction
     */
    execute(project: Project): TaskFunction {
        const themes = project.getThemes();

        const tasks: TaskFunction[] = themes.map(theme => {
            const task: TaskFunction = async (done) => {
                await Promise.all(
                    theme.getCriticalPaths().map(async criticalPath => {
                        const cssFromUrls = await Promise.all(
                            criticalPath.urls.map(async url => {
                                try {
                                    const css = await this.getCriticalCssByUrl(project, url);
    
                                    return css;
                                } catch (err) {
                                    logger(`Error getting CSS from ${url} for ${theme.getData().path}: ${err}`);
    
                                    return '';
                                }
                            })
                        );
    
                        const css = cssFromUrls.reduce((allCss: string, cssForUrl) => allCss + cssForUrl, '');
    
                        const purgedCss = await new Promise<string>(resolve => {
                            purge.purgeCSS(css, {
                                trim: true,
                                shorten: true,
                                css: ''
                            }, (err, result) => {
                                if (err) {
                                    logger(`Error purging CSS from critical path: ${criticalPath.filepath}`);
                                    logger(`The critical css for ${criticalPath.filepath} may have duplicate styles depending on provided configuration.`);
                                    resolve(css);
                                } else {
                                    resolve(result);
                                }
                            });
                        });
    
                        try {
                            // Delete old file if it exists
                            await fs.unlink(criticalPath.filepath);
                        } catch (err) {}
    
                        await fs.mkdir(dirname(criticalPath.filepath), { recursive: true });
                        await fs.writeFile(criticalPath.filepath, purgedCss);
                    })
                );
                done();
            };

            task.displayName = `critcalCss<${theme.getData().path}>`;

            return task;
        });

        if (tasks.length === 0) {
            logger(`No Critical CSS Tasks Running`);
            tasks.push(done => done());
        }

        return parallel(...tasks);
    }

    /**
     * Watch task
     * 
     * @param project | Project
     * @param theme | Theme[]
     * @returns TaskFunction
     */
    watch(project: Project): TaskFunction {
        return () => {
            watch(
                this.getWatchFiles(project),
                this.execute(project)
            )
        };
    }

    /**
     * Get watch files that retrigger critical css compilation
     * 
     * @param project | Project
     * @param themes | Themes[]
     * @returns string[]
     */
    private getWatchFiles(project: Project) {
        let files: string[] = [];

        for (const theme of project.getThemes()) {
            for (const publicDirectory of project.getThemePubDirectories(theme)) {
                files = files.concat(
                    theme.getStyleSheets()
                        .map(
                            stylesheet => join(
                                publicDirectory,
                                stylesheet.replace('.less', '.css')
                            )
                        )
                )
            }
        }

        return files;
    }

    /**
     * Get critical css string from the given URL
     * 
     * @param project | Project
     * @param url | string
     * @returns string
     */
    private async getCriticalCssByUrl(project: Project, url: string) {
        const content = await this.getContentByUrl(url);
        const userConfig = {};
        project.hooks.gulp.criticalCssConfig.call(userConfig);

        return new Promise((resolve, reject) => {
            critical.generate({
                html: content,
                ...CriticalCss.options,
                ...(userConfig || {})
            }, (err, { css }) => {
                if (err) {
                    logger(err);
                    reject(err);
                    return;
                }

                resolve(css);
            });
        });
    }

    /**
     * Get page content by url, cache using filesystem as puppeteer process is quite slow
     * 
     * @param url | string
     * @returns string
     */
    public async getContentByUrl(url: string) {
        const encodedUrl = Buffer.from(url, 'binary').toString('base64');
        const cacheDirectory = join(__dirname, '.css-critical-cache');

        if (this.firstRun) {
            const entries = await glob(`${cacheDirectory}/**/*`);

            await Promise.all(
                entries.map(
                    async entry => {
                        try {
                            await fs.unlink(entry);
                        } catch (err) {
                            logger(`Unable to delete: ${entry}`);
                        }
                    }
                )
            )

            this.firstRun = false;
        }


        if (!this.cacheMap.has(url)) {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto(url, {
                waitUntil: 'networkidle2'
            });
            await page.waitForTimeout(10000);

            const content = await page.content();

            await fs.writeFile(
                join(
                    __dirname,
                    encodedUrl
                ),
                content
            );

            this.cacheMap.set(url, true);

            return content;
        } else {
            const cachedBuffer = await fs.readFile(
                join(
                    __dirname,
                    encodedUrl
                )
            );

            return cachedBuffer.toString();
        }
    }
}