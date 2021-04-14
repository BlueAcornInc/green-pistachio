import { join } from 'path';
import Module from '../Models/Module';
import Theme from "../Models/Theme";

export type ThemeOverridePathRequest = {
    theme: Theme;
    filename: string;
    module: Module;
};

type ThemeOverridePathResult = {
    filename: string;
    webpackOutputFilePath: string;
};

export default class ThemeOverridePath {
    build(themeOverridePathRequest: ThemeOverridePathRequest): ThemeOverridePathResult {
        const {
            theme,
            filename,
            module,
        } = themeOverridePathRequest;

        return {
            filename: join(
                theme.getSourceDirectory(),
                module.getName(),
                filename
                    .replace(module.getSourceDirectory(), '')
                    .replace(`view/${theme.getData().area}/`, '')
            ),
            webpackOutputFilePath: join(
                filename
                    .replace(module.getSourceDirectory(), `${module.getName()}.`)
                    .replace(`/view/${theme.getData().area}/web/js/bundles/`, '')
            )
        };
    }
}