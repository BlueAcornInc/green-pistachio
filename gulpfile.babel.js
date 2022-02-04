/**
 * @package     BlueAcorn/GreenPistachio
 * @version     4.0.0
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @copyright   Copyright © Blue Acorn iCi. All rights reserved.
 */

/* eslint-disable */

import { parallel, series } from 'gulp';
import { cleanJs, cleanAll } from "./blueacornui/tasks/clean";
import sourceThemeDeploy from "./blueacornui/tasks/sourceThemeDeploy";
import { lessAll, watchLess } from './blueacornui/tasks/less';
import { eslintAll, eslintApp } from "./blueacornui/tasks/eslint";
import { babelAll, babelApp, watchAppJs, watchJs } from "./blueacornui/tasks/babel";
import { watchLivereload } from "./blueacornui/tasks/watch";
import watchCache from "./blueacornui/tasks/cache";

const prepareTasks = series(
    parallel(cleanJs, cleanAll),
    parallel(eslintAll, eslintApp),
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

export const compile = series(
    parallel(eslintAll, eslintApp),
    parallel(babelAll, babelApp),
    lessAll,
    (seriesDone) => {
        seriesDone();
    }
);

export const lint = series(
    eslintAll,
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
