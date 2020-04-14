import { exec } from 'child_process';

export default (command, opts = {}) => {
    return new Promise((resolve, reject) => {
        exec(command, opts, (error, stdout) => {
            if (error) {
                reject(error);
                return;
            }
            
            resolve(stdout);
        })
    });
};