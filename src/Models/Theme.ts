import glob from 'fast-glob';
import debug from 'debug';
const logger = debug('gpc:theme');

type ThemeConstructorArgs = ThemeData & {
    sourceDirectory: string;
    parent?: Theme;
};

// type CriticalCssInput = {
//     filepath: string;
//     urls: string[];
// };

export type ThemeData = {
    area: "frontend" | "adminhtml";
    path: string;
    enabled?: boolean;
    locales?: string[];
    stylesheets?: string[];
    // criticalCss?: CriticalCssInput[];
};

export default class Theme {
    private sourceDirectory: string;
    private parent?: Theme;
    private enabled: boolean | undefined;
    private data: ThemeData;

    constructor(config: ThemeConstructorArgs) {
        const {
            sourceDirectory,
            area,
            path,
            parent,
            locales,
            stylesheets,
            // criticalCss,
            enabled
        } = config;

        this.sourceDirectory = sourceDirectory;
        this.parent = parent;
        this.enabled = enabled || false;
        this.data = {
            area,
            path,
            locales,
            stylesheets,
            // criticalCss
        };
    }

    public configure(data: Partial<ThemeData>) {
        this.data = {
            ...this.data,
            ...data
        };
    }

    public getSourceDirectory() {
        return this.sourceDirectory;
    }

    public getParent() {
        return this.parent;
    }

    public getData() {
        return this.data;
    }

    public getLocales(): string[] {
        if (this.data.locales) {
            return this.data.locales;
        }

        logger(`${this.data.path}: Can't Determine Locales, defaulting to en_US`);

        return ['en_US'];
    }

    public getStyleSheets(): string[] {
        if (this.data.stylesheets) {
            return this.data.stylesheets;
        }

        logger(`${this.data.path}: Stylesheets not explicitly defined, detecting entries now.`);

        const files: Set<string> = new Set();

        const discoveredFiles = glob
            .sync(`${this.getSourceDirectory()}/**/[^_]*.less`)
            .map(sourceFile => sourceFile.replace(`${this.getSourceDirectory()}/web/`, ''));

        for (const file of discoveredFiles) {
            files.add(file);
        }

        let childTheme = this.getParent();

        while (childTheme) {
            for (const file of childTheme.getStyleSheets()) {
                files.add(file);
            }
            childTheme = childTheme.getParent();
        }

        const stylesheets = Array.from(files);

        logger(`${this.data.path}: Discovered the following stylesheets: ${stylesheets.join(', ')}`);

        return stylesheets;
    }

    // public getCriticalPaths(): CriticalCssInput[] {
    //     if (this.data.criticalCss) {
    //         return this.data.criticalCss;
    //     }

    //     logger(`No critical path data available for: ${this.data.path}`);

    //     return [];
    // }

    public getEnabled() {
        return this.enabled;
    }

    public setEnabled(enabled: undefined | boolean) {
        this.enabled = enabled;
    }
}
