import { CommandInterface, CommandOptionsInterface } from "./Commands/CommandInterface";
import TsConfigBuilder from "./Models/Project/TsConfigBuilder";
import ProjectConfigBuilder from "./ProjectConfigBuilder";

export class Application {
    public hooks = {
        
    };

    public async run<CommandOptions = CommandOptionsInterface>(command: CommandInterface, options: Partial<CommandOptions>) {
        const configBuilder = new ProjectConfigBuilder();
        const project = await configBuilder.build(options);
        
        const tsConfigBuilder = new TsConfigBuilder()
        await tsConfigBuilder.emitConfigFile(project);

        const result = await command.run({
            ...options,
            project
        });
    }
}