/// <reference types="node" />
/// <reference types="gulp-less" />

import { IOptions } from "gulp-less";

export interface LessOptions extends IOptions {
    math?: string | undefined;
    modifyVars?: {} | undefined;
    paths?: string[] | undefined;
    plugins?: any[] | undefined;
    relativeUrls?: boolean | undefined;
}
