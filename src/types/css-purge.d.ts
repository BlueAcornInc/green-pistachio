declare module 'css-purge' {
    type PurgeOptions = {
        trim?: boolean;
        shorten?: boolean;
        css?: string
    };

    type PurgeCallback = {
        (err: string, result: string): void;
    };

    function purgeCSS(css: string, options: PurgeOptions, callback: PurgeCallback): void;
}