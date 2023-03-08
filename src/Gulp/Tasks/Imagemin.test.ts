/**
 * @jest-environment node
 */
import mock from "mock-fs";
import Project from "../../Models/Project";
import Theme from "../../Models/Theme";
import { promises as fs } from "fs";
import { join } from "path";
import ImageMinGulpTask from "./Imagemin";

afterEach(() => {
    mock.restore();
});

describe("Gulp: Imagemin", () => {
    it("should minify images", () => {});

    it('should minify images', async () => {
        const files = {
            'vendor/magento/theme-frontend-blank/web/src/icon-stars.svg': `<?xml version="1.0" encoding="UTF-8"?>
            <svg width="121px" height="17px" viewBox="0 0 121 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 57.1 (83088) - https://sketch.com -->
                <title>Group 21</title>
                <desc>Created with Sketch.</desc>
                <g id="CMS" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="CMS-1440" transform="translate(-737.000000, -13757.000000)" fill="#003087">
                        <g id="Group-21" transform="translate(737.000000, 13757.000000)">
                            <g id="Icon/review-single">
                                <polygon id="Star" points="9 13.5 3.70993273 16.2811529 4.72024568 10.3905765 0.440491353 6.21884705 6.35496636 5.35942353 9 0 11.6450336 5.35942353 17.5595086 6.21884705 13.2797543 10.3905765 14.2900673 16.2811529"></polygon>
                            </g>
                            <g id="Icon/review-single" transform="translate(26.000000, 0.000000)">
                                <polygon id="Star" points="9 13.5 3.70993273 16.2811529 4.72024568 10.3905765 0.440491353 6.21884705 6.35496636 5.35942353 9 0 11.6450336 5.35942353 17.5595086 6.21884705 13.2797543 10.3905765 14.2900673 16.2811529"></polygon>
                            </g>
                            <g id="Icon/review-single" transform="translate(51.000000, 0.000000)">
                                <polygon id="Star" points="9 13.5 3.70993273 16.2811529 4.72024568 10.3905765 0.440491353 6.21884705 6.35496636 5.35942353 9 0 11.6450336 5.35942353 17.5595086 6.21884705 13.2797543 10.3905765 14.2900673 16.2811529"></polygon>
                            </g>
                            <g id="Icon/review-single" transform="translate(77.000000, 0.000000)">
                                <polygon id="Star" points="9 13.5 3.70993273 16.2811529 4.72024568 10.3905765 0.440491353 6.21884705 6.35496636 5.35942353 9 0 11.6450336 5.35942353 17.5595086 6.21884705 13.2797543 10.3905765 14.2900673 16.2811529"></polygon>
                            </g>
                            <g id="Icon/review-single" transform="translate(103.000000, 0.000000)">
                                <polygon id="Star" points="9 13.5 3.70993273 16.2811529 4.72024568 10.3905765 0.440491353 6.21884705 6.35496636 5.35942353 9 0 11.6450336 5.35942353 17.5595086 6.21884705 13.2797543 10.3905765 14.2900673 16.2811529"></polygon>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>`,
        };

        mock({
            'node_modules': mock.load(join(__dirname, '..', '..', '..', 'node_modules')),
            ...files,
        });

        const project = new Project({
            themes: [
                new Theme({
                    sourceDirectory: `vendor/magento/theme-frontend-blank`,
                    area: 'frontend',
                    path: 'Magento/blank',
                    enabled: true
                })
            ],
            modules: [],
            root: '',
        });

        const imageMin = new ImageMinGulpTask();
        imageMin.execute(project)(async () => {
            for (const file of Object.keys(files)) {
                const contents = await fs.readFile(file.replace('web/src', 'web/images'));
                expect(contents.toString()).toMatchSnapshot();
            }
        });
    });
});
