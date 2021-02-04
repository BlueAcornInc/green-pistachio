import mock from 'mock-fs';
import Theme from './Theme';

afterEach(() => {
    mock.restore();
});

describe('Theme', () => {
    it('should auto-detect stylesheets', async () => {
        mock({
            'vendor/magento/theme-frontend-blank/web/css/styles.less': '',
            'vendor/magento/theme-frontend-blank/web/css/styles-m.less': '',
            'vendor/magento/theme-frontend-blank/web/css/styles-r.less': '',
            'vendor/magento/theme-frontend-luma/web/css/styles-l.less': '',
            'vendor/magento/theme-frontend-luma/web/css/styles-m.less': '',
        });

        const blank = new Theme({
            sourceDirectory: 'vendor/magento/theme-frontend-blank',
            area: 'frontend',
            path: 'Magento/luma'
        });

        const luma = new Theme({
            sourceDirectory: 'vendor/magento/theme-frontend-luma',
            area: 'frontend',
            path: 'Magento/luma',
            parent: blank
        });

        expect(blank.getStyleSheets()).toMatchSnapshot();
        expect(luma.getStyleSheets()).toMatchSnapshot();
    });
});