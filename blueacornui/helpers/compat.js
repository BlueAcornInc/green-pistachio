export default (compatFile, config) => {
    try {
        const configTransformer = require(`${process.cwd()}/blueacornui/${compatFile}.compat`);
        return configTransformer(config);
    } catch (err) {}

    return config;
};