import { promises as fs, copy } from 'fs-extra';
import rimraf from 'rimraf';
import mkdirp from 'mkdirp';
import { userInfo } from 'os';
import path from 'path';
import exec from '../helpers/exec';
import { error } from './reporter';

export const getHomeDir = () => path.resolve(userInfo().homedir, '.green-pistachio');

export const getHomeThemeDir = () => path.resolve(getHomeDir(), 'theme');

export const getAppThemeDir = () => path.resolve(process.cwd(), 'app', 'design', 'frontend', 'BlueAcorn', 'site');

export const rimrafP = async (dir) => new Promise(resolve => rimraf(dir, resolve));

export const copyP = async (source, destination) => new Promise((resolve, reject) => {
    copy(source, destination, (err) => {
        if (err) {
            reject(err);
            return;
        }

        resolve();
    });
});

export const cloneRepo = async (dir) => {
    try {
        await exec(
            `git clone git@github.com:BlueAcornInc/ba-green-pistachio-theme-m2.git .`,
            { cwd: dir }
        )
    } catch (err) {
        error(`Error cloning repo to ${dir}, ${err}`);
    }
};

export const createBaseTheme = async () => {
    const homeThemeDir = getHomeThemeDir();
    const appThemeDir = getAppThemeDir();
    await rimrafP(homeThemeDir);
    await mkdirp(homeThemeDir);

    try {
        await cloneRepo(homeThemeDir);
        await mkdirp(path.join(process.cwd(), 'app', 'design', 'frontend', 'BlueAcorn'));
        await copyP(
            path.resolve(homeThemeDir, 'app', 'design', 'frontend', 'BlueAcorn', 'site'),
            appThemeDir
        );
    } catch (err) {
        error(err);
    }
};

export const installComposerPackage = async (composerPackage, additional = '') => {
    if (additional.length > 0 && !additional.endsWith(' ')) {
        additional += ' ';
    }

    try {
        await exec(
            `composer require ${additional}${composerPackage}`,
            { cwd: process.cwd() }
        );
        return true;
    } catch (err) {
        error(err);
        return false;
    }
}