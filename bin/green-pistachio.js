#!/usr/bin/env node

require('@babel/register')({
    cwd: require('path').resolve(__dirname, '..'),
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-transform-runtime"]
});
const { execute } = require('../blueacornui/commands');

if (process.argv.length === 2) {
    process.argv.push('-h');
}

execute();