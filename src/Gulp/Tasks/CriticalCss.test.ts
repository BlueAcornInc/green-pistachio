/**
 * @jest-environment node
 */
import { join } from 'path';
import Project from '../../Models/Project';
import Theme from '../../Models/Theme';
import { promises as fs } from 'fs';
import CriticalCss from './CriticalCss';
 
describe('Gulp: Critical CSS', () => {
    it('should include only critical styles', async (done) => {
        const root = join(
            __dirname,
            '__fixtures__',
            'critical'
        );

        const project = new Project({
            themes: [
                new Theme({
                    sourceDirectory: `${root}/vendor/magento/theme-frontend-blank`,
                    area: 'frontend',
                    path: 'Magento/blank',
                    enabled: true,
                    criticalCss: [{
                        filepath: `${root}/vendor/magento/theme-frontend-blank/web/css/critical.css`,
                        urls: ['']
                    }]
                })
            ],
            modules: [],
            root,
        });

        const criticalCss = new CriticalCss();
        CriticalCss.options = {
            ...CriticalCss.options,
            // @ts-ignore
            base: root
        };
        // Trust that puppeteer runs properly, too slow for testing
        criticalCss.getContentByUrl = async () => `
            <link rel="stylesheet" type="text/css" media="all" href="styles.css"></link>
            <h1>Hello World</h1>
        `;
        criticalCss.execute(project)(async () => {
            const styles = await fs.readFile(`${root}/vendor/magento/theme-frontend-blank/web/css/critical.css`);
            expect(styles.toString()).toMatchSnapshot();
            try {
                await fs.unlink(`${root}/vendor/magento/theme-frontend-blank/web/css/critical.css`);
            } catch (err) {}
            done();
        });
    });
});