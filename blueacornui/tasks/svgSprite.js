/**
 * @package     BlueAcorn/GreenPistachio
 * @version     4.0.0
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @copyright   Copyright © Blue Acorn iCi. All rights reserved.
 */

import path from 'path';
import {
    src,
    dest,
    series,
    parallel,
    task,
    watch
} from 'gulp';
import plumber from 'gulp-plumber';
import svgSprite from 'gulp-svg-sprite';
import activeThemes from '../utils/activeThemes';
import {
    imageminSrc,
    spriteSourceFiles,
    svgSpriteFiles
} from '../utils/combo';
import compat from '../helpers/compat';

const config = compat('svgSprite', {
    svg: {
        percision: 4,
        xmlDeclaration: true,
        doctypeDeclaration: true,
        namespaceIDs: true,
        namespaceClassnames: true,
        dimensionAttributes: true
    },
    shape: {
        dest: '../src/intermediate-svg',
        spacing: {
            padding: 0,
            box: 'content'
        }
    },
    mode: {
        view: {
            dest: '../css/',
            prefix: '.svg-',
            bust: false,
            sprite: '../src/sprites.svg',
            mixin: 'svg',
            common: 'svg',
            layout: 'vertical',
            render: {
                less: {
                    dest: '../css/source/blueacorn/_sprites.less',
                    template: path.join(__dirname, '../assets/tmpl/_sprite-mixins.less')
                }
            },
            example: {
                dest: '../../BlueAcorn_GreenPistachio/templates/svg_sprites.phtml',
                template: path.join(__dirname, '../assets/tmpl/svg_sprites.phtml')
            }
        }
    }
});

const ExecuteSvgSpriteTasks = (themeCwd, themeDest, done) => {
    src('**/*.svg', {
        cwd: themeCwd
    })
        .pipe(plumber())
        .pipe(svgSprite(config))
        .pipe(dest(themeDest))
        .on('end', done);
};

activeThemes.forEach((theme) => {
    task(`svgSprite.${theme.name}`, (done) => {
        ExecuteSvgSpriteTasks(
            spriteSourceFiles(theme),
            imageminSrc(theme),
            done
        );
    });
});

export const svgSpriteAll = (done) => {
    const spriteTasks = activeThemes.map((theme) => `svgSprite.${theme.name}`);

    return series(parallel(...spriteTasks), (seriesDone) => {
        seriesDone();
        done();
    })();
};

task('svgSpriteAll', (done) => svgSpriteAll(done));

export const watchSvgSprites = (done) => {
    watch(svgSpriteFiles(), (done) => svgSpriteAll(done));
};
