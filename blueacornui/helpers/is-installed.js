import { promises as fs } from 'fs';
import path from 'path';
import exec from './exec';

export default async () => {
    try {
        await fs.stat(path.resolve(process.cwd(), 'gulp-config.js'));
        return true;
    } catch (error) {
        return false;
    }
};

export const isComposerPackageInstalled = async (composerPackage) => {
    try {
        await exec(
            `composer show ${composerPackage}`,
            { cwd: process.cwd() }
        );
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};
