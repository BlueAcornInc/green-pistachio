declare module 'critical' {
    type GenerateOptions = {
        html?: string;
        dimensions?: Viewport[];
        minify?: boolean;
    };

    type Viewport = {
        width: number;
        height: number;
    };

    type GenerateCallback = {
        (err: string, result: GenerateCallbackResult): void;
    };

    type GenerateCallbackResult = {
        css: string;
    };

    function generate(options: GenerateOptions, callback: GenerateCallback): void;
}