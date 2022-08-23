# Green Pistachio

Magento 2 Front-end Build Tools

## What it is

Green Pistachio provides an opinionated set of configs
that can be run independently of a specific Magento 2 implementation.

## Features

* Modern Javascript Compilations for ES6 & TypeScript compilation.
* SVG/PNG Sprite sheeting with custom mixins.
* Automatic cache cleaning with [Mage2TV Cache Clean](https://github.com/mage2tv/magento-cache-clean)
* Linting for ES6
* Image minification
* Less Compilation

## What has changed?

### Apple Silicon
To support Apple Silicon we had to make a lot of changes.  There were many packages that did not support the new architecture and had to be replaced or in some instances thrown out.

### CriticalCSS is Gone
Due to some old dependencies we had to throw this out, we didn't even agree with the approach to be honest.  We had some other ideas on how to leverage LESS to do the dirty work for us, and be more explicit with what we wanted in our CriticalCSS files.

### Bye-Bye GIF support
The image optimization tools we were using before were not updated to support Apple Silicon, and it does not look like they will be any time soon, they might be dead projects.  We've switched to using `gulp-libsquoosh` and `gulp-svgmin` to handle this, we still support `PNG, JPG, JPEG, SVG`, we just no longer support `GIF`

### Tests Broke :(
There's always good intentions with having your software testable, but changes in `jest` required us to have to throw out our tests for now, we'll need to refactor them in the future, but getting our team up and running with Green Pistachio was the priority.

### Why is it 5.0, doesn't seem like a 5.0
We didn't want to break anything to be honest, there were a lot of changes that needed to be made to support Apple Silicon, some people are still on Intel Based/AMD based systems that won't need to upgrade yet. This allows us to choose where we need to and must upgrade vs. forcing it on everyone.
