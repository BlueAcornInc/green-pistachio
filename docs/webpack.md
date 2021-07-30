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
