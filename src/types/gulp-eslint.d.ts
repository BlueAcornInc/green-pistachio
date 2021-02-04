declare module 'gulp-eslint' {
    declare function eslint(): any;
    eslint.format = () => {}
    export = eslint;
}