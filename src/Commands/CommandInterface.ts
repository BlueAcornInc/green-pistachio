import Project from "../Models/Project";

export interface CommandOptionsInterface {
    project: Project;
};

export interface CommandInterface {
    run(config: CommandOptionsInterface): Promise<boolean>; 
}