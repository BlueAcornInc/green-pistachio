import program from 'commander';
import installCommand from './install';
import gulpCommand from './gulp';

const commands = [
    installCommand,
    gulpCommand
];

program.version('4.0.0');

export const execute = async (args = process.argv) => {
    for (const command of commands) {
        await command(program);
    }

    return program.parse(args);
};