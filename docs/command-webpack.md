# Webpack Command

This command will run webpack dev server and proxy your local magento instance. Any file changes will be picked up by webpack and will either refresh your browser window, or hot reload (if possible).

Note: If you're running your local environment through docker, ensure that you run the webpack command on your host machine. Additionally, you'll need to configure the local proxy URL in your green-pistachio.config.js file. See how to do this in the [Webpack Configuration](webpack.md) documentation.

```
gpc webpack
```