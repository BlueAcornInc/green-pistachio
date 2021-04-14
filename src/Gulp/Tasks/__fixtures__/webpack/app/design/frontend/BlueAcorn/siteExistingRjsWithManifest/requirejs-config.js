var config = {
    deps: [
        'js/some-file'
    ]
};

/** START: MagentoRequireJsManifestPlugin */
config = config || {};
config.map = (config.map || {});
config.map['*'] = (config.map['*'] || {});
config.map['*']['BlueAcorn_Module/js/module-old.bundle'] = 'bundle/BlueAcorn_Module.module.bundle';
/** END: MagentoRequireJsManifestPlugin */