import { exec } from 'child_process';

export default class CommandRunner {
    public execute(command: string, options: Record<string, any> = {}): Promise<{ error: string | null, stdout: string }> {
        return new Promise((resolve, reject) => {
            exec(command, options, (error, stdout) => {
                if (error) {
                    return reject({ error, stdout });
                }

                return resolve({ error, stdout });
            });
        });
    }
}