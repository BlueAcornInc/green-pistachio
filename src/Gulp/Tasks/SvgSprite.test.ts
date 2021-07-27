/**
 * @jest-environment node
 */
import Project from '../../Models/Project';
import Theme from '../../Models/Theme';
import { promises as fs } from 'fs';
import { join } from 'path';
import SvgSprite from './SvgSprite';

describe('Gulp: SVG Sprite', () => {
    it('should generate svg sprite', async (done) => {
        const root = join(
            __dirname,
            '__fixtures__',
            'svgsprite'
        );

        const expectedOutputFiles = [
            `${root}/vendor/magento/theme-frontend-blank/web/src/intermediate-svg/icon-stars.svg`,
            `${root}/vendor/magento/theme-frontend-blank/web/src/sprites.svg`,
            `${root}/vendor/magento/theme-frontend-blank/web/css/source/blueacorn/_sprites.less`,
            `${root}/vendor/magento/theme-frontend-blank/BlueAcorn_CmsFramework/templates/framework/sprites.phtml`,
        ];

        const project = new Project({
            themes: [
                new Theme({
                    sourceDirectory: `${root}/vendor/magento/theme-frontend-blank`,
                    area: 'frontend',
                    path: 'Magento/blank',
                    enabled: true
                })
            ],
            modules: [],
            root,
        });


        const svgSprite = new SvgSprite();
        svgSprite.execute(project)(async () => {
            for (const expectedOutputFile of expectedOutputFiles) {
                const contents = await fs.readFile(expectedOutputFile);
                expect(contents.toString()).toMatchSnapshot();
                await fs.unlink(expectedOutputFile)
            }

            done();
        });
    });
});
