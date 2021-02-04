declare module 'gulp-clean' {
    type GulpCleanArgs = {
        force: boolean;
        allowEmpty: boolean;
    };
    export = (args: GulpCleanArgs) => any;
}