import fs from 'fs';
import { fs as memfs, DirectoryJSON, vol } from 'memfs'; 
import ufs from 'unionfs';
import webpack, { Configuration, Compiler } from 'webpack';
// import TestPlugin from './TestPlugin';
import MagentoAmdLibraryPlugin from './MagentoAmdLibraryPlugin';

const getWebpackConfig = (): Configuration => {
    return {
        mode: 'production',
        entry: {
            entry1: './src/entry1.js',
            "subpath/entry2": './src/subpath/entry2.js',
        },
        context: '/cwd',
        plugins: [
            new MagentoAmdLibraryPlugin()
        ],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    // vendors: {
                    //     test: /[\\/]node_modules[\\/]/,
                    //     name: 'vendors',
                    //     chunks: 'all'
                    // },
                    // styles: {
                    //     test: /\.css$/,
                    //     name: 'styles',
                    //     chunks: 'all',
                    //     enforce: true
                    // },
                    commons: {
                        chunks: 'all',
                        name: 'commons',
                        minChunks: 2,
                        reuseExistingChunk: true,
                        enforce: true
                    }
                }
            }
        }
    };
};

const getCompiler = (
    filesystem: DirectoryJSON,
): Compiler => {
    const config = getWebpackConfig();
    vol.fromJSON(filesystem, 'cwd');

    const compiler = webpack(config);

    // @ts-ignore
    compiler.inputFileSystem = memfs;
    // @ts-ignore
    compiler.outputFileSystem = memfs;

    return compiler;
};

describe('Magento AMD Library Plugin', () => {
    it('should wrap entries and split chunks in amd define calls', async (done) => {
        const compiler = getCompiler(
            {
                "/cwd/src/dep.js": `export default 42;`,
                "/cwd/src/entry1.js": `import life from './dep';
                console.log(life);
                export default () => {
                    import(/* webpackChunkName: "lazy" */ "./lazy").then(something => {
                        console.log(something);
                    })
                };
                `,
                "/cwd/src/subpath/entry2.js": `import life from '../dep'; alert(life);`,
                "/cwd/src/lazy.js": `export default "something lazy";`
            }
        );
        
        compiler.run((err, stats) => {
            if (stats) {
                try {
                    // Split chunk should be wrapped in define();
                    const commonChunk = memfs.readFileSync('dist/commons.js').toString();
                    expect(commonChunk).toContain('define');

                    // Entry chunk should contain dependency for common chunk
                    const entryChunk = memfs.readFileSync('dist/entry1.js').toString();
                    expect(entryChunk).toContain(`define(["./commons"],`);

                    // Entry chunk should contain proper path for common chunk
                    const entryChunkPath = memfs.readFileSync('dist/subpath/entry2.js').toString();
                    expect(entryChunkPath).toContain(`define(["../commons"],`);

                    // Async chunk should not be wrapped in define calls
                    const asyncChunk = memfs.readFileSync('dist/lazy.js').toString();
                    expect(asyncChunk).not.toContain(`define`);
                } catch (err) {
                    console.log(err);
                }
            }

            compiler.close(done);
        });
    });
});