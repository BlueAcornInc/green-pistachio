/**
 * @package     BlueAcorn/GreenPistachio
 * @version     4.0.0
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @author      Michael Bottens <michael.bottens@blueacorn.com>
 * @copyright   Copyright © Blue Acorn iCi. All rights reserved.
 */

/* eslint-disable */

import { parallel, series } from 'gulp';
import { cleanJs, cleanAll } from "./blueacornui/tasks/clean";
import sourceThemeDeploy from "./blueacornui/tasks/sourceThemeDeploy";
import { lessAll, watchLess } from './blueacornui/tasks/less';
import { imageminAll, watchImages } from "./blueacornui/tasks/imagemin";
import { eslintAll, eslintApp } from "./blueacornui/tasks/eslint";
import { babelAll, babelApp, watchAppJs, watchJs } from "./blueacornui/tasks/babel";
import { watchLivereload } from "./blueacornui/tasks/watch";
import { svgSpriteAll } from "./blueacornui/tasks/svgSprite";
import { pngSpriteAll } from "./blueacornui/tasks/pngSprite";
import watchCache from "./blueacornui/tasks/cache";

const prepareTasks = series(
    parallel(cleanJs, cleanAll),
    parallel(svgSpriteAll, pngSpriteAll),
    parallel(imageminAll, eslintAll, eslintApp),
    parallel(babelAll, babelApp),
    sourceThemeDeploy
);

const compileTasks = series(
    lessAll,
    (seriesDone) => {
        seriesDone();
    }
);

const watchTasks = parallel(
    watchLess,
    watchImages,
    watchJs,
    watchAppJs,
    watchLivereload,
    watchCache
);

export const defaultTasks = series(
    prepareTasks,
    compileTasks,
    watchTasks,
    (seriesDone) => {
        seriesDone();
    }
);

export const watch = series(
    compileTasks,
    watchTasks,
    (seriesDone) => {
        seriesDone();
    }
);

export {
    prepareTasks,
    compileTasks,
    watchTasks
};

export default defaultTasks;
