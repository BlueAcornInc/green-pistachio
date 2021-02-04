import Project from "../Models/Project";

export interface CommandOptionsInterface {
    project: Project;
    theme?: string;
    includePath?: string;
};

export interface CommandInterface {
    run(config: CommandOptionsInterface): Promise<boolean>; 
}