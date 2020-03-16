/**
 * @package     BlueAcorn/GreenPistachio
 * @version     4.0.0
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @copyright   Copyright © Blue Acorn iCi. All rights reserved.
 */

import livereload from 'gulp-livereload';

export const watchLivereload = (done) => {
    livereload.listen();
    done();
};
