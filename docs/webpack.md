## The `Webpack` Configuration

Within your `green-pistachio.config.js` you'll be able to configure Webpack using a couple different kinds of hooks.

### Configuring webpack dev server

Webpack dev server has been configured to proxy the local Magento instance, and include the generated files from webpack. In order for this to work, you'll need to configure the URL in your green-pistachio.config.js file.

The configuration below will create a proxy listening at https://green-pistachio.test:8080 and route requests to https://patriciasboutique.com 

```javascript
project.hooks.configure.tap('Green Pistachio - Configure', project => {
    project.setWebpackDevServerConfig({
        proxyUrl: 'https://patriciasboutique.com', // required
        devServerUrl: 'green-pistachio.test', // optional
        devServerPort: 8080 // optional
    });
});
```

### Modifying the generated webpack configuration object

Typically, we can create webpack.config.js files in a project, and run webpack against that. With green-pistachio, the webpack configuration is generated automatically based on the project. This was necessary in order to get webpack to understand the Magento theme fallback system. In order to modify this generated configuration, you can tap into the webpack config hook to make your modifications. 

Example on how to include the graphql loader:

```javascript
project.hooks.webpack.config.tap('Green Pistachio - Webpack', config => {
   config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader'
   });
});
```

### Sources and Destinations

Webpack entrypoints are gathered programatically by searching through each module and theme, and looking for files in: `web/js/bundles/**/*.bundle.{ts,js,tsx,jsx}`

Confused? Check out the table below:

[comment]: # (The table below was generated here: https://www.tablesgenerator.com/markdown_tables# It can be copy pasted into this generator for easy updating in the future)

| Source                                                                              | Destination                                                                |
|-------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| app/code/Vendor/Module/view/frontend/web/js/bundles/customizer.bundle.js            | app/code/Vendor/Module/view/frontend/web/js/customizer.bundle.js           |
| app/design/frontend/BlueAcorn/site/web/js/bundles/menu.bundle.ts                    | app/design/frontend/BlueAcorn/site/web/js/menu.bundle.js                   |
| app/code/Vendor/Module/view/base/web/js/bundles/global.bundle.jsx                   | app/code/Vendor/Module/view/base/web/js/global.bundle.js                   |
| app/design/frontend/BlueAcorn/site/Vendor_Module/web/js/bundles/checkout.bundle.tsx | app/design/frontend/BlueAcorn/site/Vendor_Module/web/js/checkout.bundle.js |

[comment]: # (End Table Generator Comment)

### Experiments

The webpack workflow has plenty of room for improvement. New features may be added under an experimental flag. That said
there are currently two experiments that can be turned on in the `green-pistachio.config.js` file:

1. `project.experiments.webpack.hmr = true`: This flag adds some webpack plugins and configurations to enhance the webpack 
hot reload functionality. This is currently pretty unstable, thus why it is hidden behind an experiments flag.
2. `project.experiments.webpack.cssModules = true`: This flag adds CSS modules support to allow CSS file processing and using
scoped styles for React components in a project. 
3. `project.experiments.webpack.emitFilesToPub = true`: This flag will configure the build command to emit files directly to the pub directories for each locale
