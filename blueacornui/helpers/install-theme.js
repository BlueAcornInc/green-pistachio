import { promises as fs, copy } from 'fs-extra';
import rimraf from 'rimraf';
import mkdirp from 'mkdirp';
import { userInfo } from 'os';
import path from 'path';
import exec from '../helpers/exec';
import { error, info } from './reporter';
import inquirer from 'inquirer';

export const getHomeDir = () => path.resolve(userInfo().homedir, '.green-pistachio');

export const getHomeThemeDir = () => path.resolve(getHomeDir(), 'theme');

export const getAppThemeDir = () => path.resolve(process.cwd(), 'app', 'design');

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
        const { theme_repo } = await inquirer
            .prompt([{
                type: 'input',
                name: 'theme_repo',
                message: 'Where should the base theme be cloned from?',
                default: 'git@github.com:BlueAcornInc/ba-green-pistachio-theme-m2.git'
            }]);

        await exec(
            `git clone ${theme_repo} .`,
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
        info('installing base theme');
        await cloneRepo(homeThemeDir);
        await mkdirp(path.join(process.cwd(), 'app', 'design'));
        await copyP(
            path.resolve(homeThemeDir, 'app', 'design'),
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