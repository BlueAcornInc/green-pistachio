declare module 'gulp-livereload' {
    declare function livereload(): any;
    livereload.listen = () => {}
    export = livereload;
}