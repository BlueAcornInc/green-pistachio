import chalk from 'chalk';

export const info = (message) => console.log(chalk.blue(message));

export const error = (message) => console.log(chalk.red(message));

export const success = (message) => console.log(chalk.green(message));