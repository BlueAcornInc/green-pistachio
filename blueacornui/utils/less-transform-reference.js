import through from 'through2';
import { PluginError } from 'gulp-clean/utils';

/**
 * lessc does not follow nested &:extend when used from a (reference) import
 * breaking usage of _extends.less when compiling with gulp vs php
 * 
 * For development purposes, remove the reference import, this will allow the styles 
 * to compile properly
 */
export default () => through.obj((vinylFile, encoding, callback) => {
    if (vinylFile.isNull()) {
        return callback(null, vinylFile);
    }

    if (vinylFile.isStream()) {
        return callback(new PluginError('blueacornui', 'Streaming not supported'));
    }

    const transformedFile = vinylFile.clone();
    const contents = transformedFile.contents.toString();

    transformedFile.contents = new Buffer(contents.replace('(reference)', ''));

    callback(null, transformedFile);
});