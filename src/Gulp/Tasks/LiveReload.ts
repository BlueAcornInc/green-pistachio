import { series, TaskFunction } from 'gulp';
import livereload from 'gulp-livereload';
import { TaskInterface } from './TaskInterface';

export default class LiveReload implements TaskInterface {
    execute(): TaskFunction {
        const liveReloadTask: TaskFunction = (done) => {
            livereload.listen();
            done
        };

        liveReloadTask.displayName = 'liveReload';

        return series(liveReloadTask);
    }

    watch(): TaskFunction {
        return this.execute();
    }
}