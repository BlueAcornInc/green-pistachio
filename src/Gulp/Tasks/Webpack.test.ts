/**
 * @jest-environment node
 */
import { join } from "path";
import { promises as fs } from "fs";
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";
import Webpack from "./Webpack";
import Module from "../../Models/Module";
import mock from "mock-fs";

afterEach(() => {
    mock.restore();
});

const root = join(__dirname, "__fixtures__", "webpack");

const prepareProject = (themes: Theme[]) => {
    return new Project({
        themes,
        modules: [
            new Module({
                name: "BlueAcorn_Module",
                sourceDirectory: `${root}/app/code/BlueAcorn/Module`,
                enabled: true,
            }),
        ],
        root,
    });
};

describe("Gulp: Webpack", () => {
    it("should compile webpack", () => {});

    // TODO: Rewrite Webpack Tests
    it('should compile webpack', async () => {
        const expectedOutputFiles = [
            `${root}/app/code/BlueAcorn/Module/view/frontend/web/js/module.bundle.js`,
            `${root}/pub/static/frontend/BlueAcorn/site/en_US/bundle/test-ts.bundle.js`,
            `${root}/pub/static/frontend/BlueAcorn/site/en_US/bundle/test.bundle.js`,
            `${root}/pub/static/frontend/BlueAcorn/site/en_US/bundle/BlueAcorn_Module/theme.bundle.js`,
            `${root}/pub/static/frontend/BlueAcorn/site/en_US/bundle/BlueAcorn_Module/module.bundle.js`,
            `${root}/pub/static/frontend/BlueAcorn/site/en_US/bundle/dynamic-import.js`,
            `${root}/pub/static/frontend/BlueAcorn/site/en_US/bundle/commons.js`,
            `${root}/pub/static/frontend/BlueAcorn/site/en_US/bundle/manifest.json`,
            `${root}/app/design/frontend/BlueAcorn/site/requirejs-config.js`,
        ];

        const themes = [
            new Theme({
                sourceDirectory: `${root}/app/design/frontend/BlueAcorn/site`,
                area: 'frontend',
                path: 'BlueAcorn/site',
                enabled: true
            })
        ];

        const project = prepareProject(themes);

        const webpack = new Webpack();
        webpack.execute(project)(async () => {
            for (const expectedOutputFile of expectedOutputFiles) {
                const contents = await fs.readFile(expectedOutputFile);
                expect(contents.toString()).toMatchSnapshot();
                await fs.unlink(expectedOutputFile)
            }
        });
    });

    it('should update existing requirejs-config.js file #1', async () => {
        const themes = [
            new Theme({
                sourceDirectory: `${root}/app/design/frontend/BlueAcorn/siteExistingRjs`,
                area: 'frontend',
                path: 'BlueAcorn/site',
                enabled: true
            })
        ];

        const project = prepareProject(themes);
        const rjsfile = `${root}/app/design/frontend/BlueAcorn/siteExistingRjs/requirejs-config.js`;
        const originalContent = await fs.readFile(rjsfile);

        const webpack = new Webpack();
        webpack.execute(project)(async () => {
            const contents = await fs.readFile(rjsfile);
            expect(contents.toString()).toMatchSnapshot();
            await fs.writeFile(rjsfile, originalContent.toString());
            await fs.unlink(`${root}/pub/static/frontend/BlueAcorn/site/en_US/bundle/BlueAcorn_Module/module.bundle.js`);
            await fs.unlink(`${root}/pub/static/frontend/BlueAcorn/site/en_US/bundle/manifest.json`);
        });
    });

    it('should update existing requirejs-config.js file #2', async () => {
        const themes = [
            new Theme({
                sourceDirectory: `${root}/app/design/frontend/BlueAcorn/siteExistingRjsWithManifest`,
                area: 'frontend',
                path: 'BlueAcorn/site',
                enabled: true
            })
        ];

        const project = prepareProject(themes);
        const rjsfile = `${root}/app/design/frontend/BlueAcorn/siteExistingRjsWithManifest/requirejs-config.js`;
        const originalContent = await fs.readFile(rjsfile);

        const webpack = new Webpack();
        webpack.execute(project)(async () => {
            const contents = await fs.readFile(rjsfile);
            expect(contents.toString()).toMatchSnapshot();
            await fs.writeFile(rjsfile, originalContent.toString());
            await fs.unlink(`${root}/pub/static/frontend/BlueAcorn/site/en_US/bundle/BlueAcorn_Module/module.bundle.js`);
            await fs.unlink(`${root}/pub/static/frontend/BlueAcorn/site/en_US/bundle/manifest.json`);
        });
    });
});
