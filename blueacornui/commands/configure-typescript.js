import { success } from '../helpers/reporter';
import { createTypescriptConfigFiles } from '../helpers/typescript';

export default async (program) => {
    program
        .command('configure-typescript')
        .action(async () => {
            await createTypescriptConfigFiles();
            success(`config files created`);
        });
};