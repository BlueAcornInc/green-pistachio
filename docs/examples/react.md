## Configuring Green Pistachio with React

The newest version of Green Pistachio has webpack support built-in. With minimal setup, we can easily include modern
tools and frameworks within a project. Getting set up with React is easy. Install React and React DOM in your project
root, and include them within your bundle.
 
> If you want to compile React components with TypeScript, be sure to use the .tsx file extension, and install the
> requisite dev dependencies: @types/react and @types/react-dom 

### Step by step instructions

1. If you are starting a new project, be sure to follow the [installation](installation.md) and
[project setup](project-setup.md) guides.
2. Install dependencies:
```shell
yarn add react react-dom
yarn add -D @types/react @types/react-dom
```
3. Create an [entry point](webpack.md)
```shell
touch app/code/Vendor/Module/view/frontend/web/js/bundles/entry.bundle.tsx
```
4. Add React code to new entry point:

```typescript jsx
import React from 'react';
import ReactDOM from 'react-dom';

function Application() {
    return <p>Customizer</p>
}

export default function initializeCustomizer(element: HTMLElement) {
    ReactDOM.render(
        <Application />,
        element
    );
}
```

5. Run `yarn gpc webpack`
6. Navigate to `https://green-pistachio.test:8080`
7. Run the following in the browser console:
```javascript
require(['Vendor_Module/js/entry.bundle'], bundle => {
    bundle.default(document.getElementById('maincontent'))
})
```

8. Making your bundle files compatible with `data-mage-init` and `text/x-magento-init`

> Notice how the code in step 7 uses the `default` export of `Vendor_Module/js/entry.bundle`. This means you will not be able
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

### Being responsible

Magento is already heavy on Javascript, and React is a pretty large library to include on top of Magento. We recommend 
[configuring Green Pistachio to use Preact](examples/preact.md) to keep bundle sizes small. Additionally, be mindful of how many dependencies
you install from NPM. Apollo is an _excellent_ tool to query a GraphQL endpoint, but including it on top of Magento
will drastically increase the size of all JS on the page. Consider using smaller libraries when possible. 
