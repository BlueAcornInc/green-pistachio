type ModuleConstructorArgs = {
    sourceDirectory: string;
    name: string;
    enabled?: boolean;
};

export default class Module {
    private name: string;
    private sourceDirectory: string;
    private enabled: boolean;

    constructor(config: ModuleConstructorArgs) {
        const { name, sourceDirectory, enabled } = config;

        this.name = name;
        this.sourceDirectory = sourceDirectory;
        this.enabled = enabled || false;
    }

    public getName() {
        return this.name;
    }

    public getSourceDirectory() {
        return this.sourceDirectory;
    }

    public getEnabled() {
        return this.enabled;
    }

    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }
}