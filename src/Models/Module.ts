type ModuleConstructorArgs = {
    sourceDirectory: string;
    name: string;
};

export default class Module {
    private name: string;
    private sourceDirectory: string;

    constructor(config: ModuleConstructorArgs) {
        const { name, sourceDirectory } = config;

        this.name = name;
        this.sourceDirectory = sourceDirectory;
    }

    public getName() {
        return this.name;
    }

    public getSourceDirectory() {
        return this.sourceDirectory;
    }
}