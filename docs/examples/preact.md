## Configuring Green Pistachio with Preact

The newest version of Green Pistachio has webpack support built-in. With minimal setup, we can easily include modern
tools and frameworks within a project. If you're interested in React, we encourage you to try Preact instead to reduce
total Javascript bundle sizes.
 
> If you want to compile Preact components with TypeScript, be sure to use the .tsx file extension. 

### Step by step instructions

1. If you are starting a new project, be sure to follow the [installation](installation.md) and
[project setup](project-setup.md) guides.
2. Install dependencies:
```shell
yarn add preact
yarn add -D @babel/preset-react babel-plugin-jsx-pragmatic
```
3. Green Pistachio Configuration Updates
    1. We'll need to inform typescript of our usage of Preact
    2. We'll need to inform babel of our usage of Preact

```javascript
// Add the following to tsconfig.json
{
    ...
    "compilerOptions": {
        ...
        "jsxFactory": "h"
    }
}

// Add the following to your green-pistachio.config.js file
module.exports = project => {
    ...
    // Tells babel to use preact to compile jsx, will automatically replace React.createElement with h
    project.hooks.webpack.config.tap("Preact Configuration", (config) => {
        const babelLoader = config.module.rules.find(rule => rule.loader.includes('babel-loader'));

        if (babelLoader) {
            babelLoader.options.presets.push([
                require('@babel/preset-react').default,
                {
                    pragma: 'h',
                    pragmaFrag: 'Fragment'
                }
            ]);

            babelLoader.options.plugins.push([
                require('babel-plugin-jsx-pragmatic'),
                {
                    module: 'preact',
                    import: 'h',
                    export: 'h'
                }
            ]);
        }

        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            'react': 'preact/compat',
            'react-dom': 'preact/compat'
        };
    });
};
```

4. Create an [entry point](webpack.md)
```shell
touch app/code/Vendor/Module/view/frontend/web/js/bundles/entry.bundle.tsx
```
5. Add Preact code to new entry point:

```typescript jsx
import { render, h } from 'preact';

function Application() {
    return <p>Customizer</p>
}

export default function initializeCustomizer(element: HTMLElement) {
    render(
        <Application />,
        element
    );
}
```

6. Run `yarn gpc webpack`
7. Navigate to `https://green-pistachio.test:8080`
8. Run the following in the browser console:
```javascript
require(['Vendor_Module/js/entry.bundle'], bundle => {
    bundle.default(document.getElementById('maincontent'))
})
```

9. Making your bundle files compatible with `data-mage-init` and `text/x-magento-init`

> Notice how the code in step 8 uses the `default` export of `Vendor_Module/js/entry.bundle`. This means you will not be able
> to use bundle files directly with `data-mage-init` and `text/x-magento-init`. This leaves you with two options. One, you 
> can have the bundle file initialize itself automatically, and include it on the page using requirejs-config.js deps array.
> Or two, create a thin wrapper around the bundle that will have the proper AMD return statement.

You could create a thin wrapper for each individual bundle, like so:

```javascript
// app/code/Vendor/Core/view/frontend/web/js/entry-initializer.js
define(['Vendor_Module/js/entry.bundle'], (bundle) => (options, element) => bundle.default(element, options));

// Usage:
<div data-mage-init='{"Vendor_Module/js/entry-initializer": {}}'></div>
```

It would probably make more sense to create a bundle-initializer.js file to handle this for any bundle you create:

```javascript
// app/code/Vendor/Core/view/base/web/js/bundle-initializer.js
define(() => ({ bundle, ...options }, element) =>
    require([bundle], bundle => bundle.default(element, options))
);

// Usage:
<div data-mage-init='{"Vendor_Module/js/bundle-initializer": {"bundle": "Vendor_Module/js/entry.bundle"}}'></div>
```
