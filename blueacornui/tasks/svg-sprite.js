/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     3.0.0
 * @author      Blue Acorn, LLC. <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2018 Blue Acorn, LLC.
 */

const svgSprite = require('gulp-svg-sprite');
const plumber = require('gulp-plumber');
const path = require('path');
const util = require('util');
const combo = require('../helpers/_combo');
const themes = require('../../gulp-config');
const DefaultRegistry = require('undertaker-registry');

function SvgSpriteTasks() {
    'use strict';

    DefaultRegistry.call(this);
}

util.inherits(SvgSpriteTasks, DefaultRegistry);

SvgSpriteTasks.prototype.init = (gulp) => {
    'use strict';

    let tasks = [];

    const config = {
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
                padding: 5,
                box: "content"
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
    };

    function ExecuteSvgSpriteTasks(theme) {
        return new Promise((resolve) => {
            gulp.src('**/*.svg', {
                cwd: combo.autoPathSpriteSrc(theme),
            })
                .pipe(plumber())
                .pipe(svgSprite(config))
                .pipe(gulp.dest(combo.autoPathImageSrc(theme)))
                .on('end', resolve);
            resolve();
        });
    }

    for (let theme in themes) {
        if (themes.hasOwnProperty(theme)) {
            gulp.task(`svg-sprite:${theme}`, (done) => {
                ExecuteSvgSpriteTasks(theme).then(done);
            });
        }
    }
};

module.exports = new SvgSpriteTasks();