<!--
/**
 * @package     BlueAcorn/GreenPistachio2
 * @version     2.0.1
 * @author      Blue Acorn iCi <code@blueacorn.com>
 * @author      Greg Harvell <greg@blueacorn.com>
 * @copyright   Copyright © 2019, All Rights Reserved.
 */
-->
<p align="center"><img src="../.readme/logo.png" width="220" height="46" alt="Blue Acorn" align="center" /></p>

<br/>

<h1 align="center"><img src="../.readme/gp-logo.png" width="220" height="38" alt="Green Pistachio" valign="middle" /> <br>Theme for <img src="../.readme/magento-logo.png" width="160" height="46" alt="Magento" valign="middle" /> 2</h1>


### Table of Contents


1. [Setting Up Your Theme](#setting-up-your-theme)
2. [Before You Compile](#before-you-compile)
3. [Wait What's Happening](#wait-whats-happening)
	* [Less Compilation](#less-compilation)
	* [Babel/ES6](#babel-es6)
	* [SVG Sprites](#svg-sprites)
	* [PNG Sprites](#png-sprites)
4. [Compiling & Watching](#compiling-and-watching)
	* [Compile Everything, Watch It All](#compile-everything-watch-it-all)
	* [Compile Everything, without resymlinking it, Watch It All](#compile-everything-without-resymlinking-it-watch-it-all)
	* [Compile](#compile)
	* [CSS](#css)
	* [Images](#images)
	* [JS](#js)
	* [Dev](#dev)



Setting Up Your Theme
--

The Themes file is located at `gulp-config.js`, open this in your editor/IDE of choice. Within the file you will find an object called `themes`, each key represents one **theme** in your workflow.

```javascript
site: {
	gulp: true,
	appPath: 'frontend',
	themePath: 'BlueAcorn/site',
	dev_url: 'm2.test',
	locale: 'en_US',
	stylesheets: [
		'css/styles-m',
		'css/styles-l',
		'css/grid'
	]
}
```

The **key** is the name of your theme, and used when executing theme specific grunt commands such as `grunt less:site`.

The value/object tells grunt how to process your theme.

| Setting | Description |
|---------|-------------|
| `gulp` | Tells the grunt process whether or not this theme should be included in compilation. |
| `appPath` | Section of the site where we are compiling, if you had a custom admin theme, in theory you could set this to `adminhtml`, for now let's not get crazy, it's just `frontend` |
| `themePath` | Path within app/design/`appPath`/ where you wish to compile, in the example above we have `BlueAcorn/site` (our standard), and it would tell the grunt process to look in app/design/frontend/BlueAcorn/site for files it needs to compile. |
| `dev_url` | Local URL used for the site, in most instances this will be client code followed by .test |
| `locale` | TBD |
| `stylesheets` | Array of parent stylesheets that you wish to compile from `less` to `css`. Doesn't change often, more likely to add a new one. |

Before You Compile
--

These are helpful common suggestions, you will not need to do this every-time you go to work on the site, but at least the first time it's helpful.


1. It's always a good idea to make sure composer packages are up to date.  Do so by running the following commands from the site's root dir.

	```bash
	composer install && composer update
	```

2. Make sure your Magento DB is up to date.  Do so by running the following commands from the site's root dir.

	```bash
	php bin/magento setup:upgrade && php bin/magento indexer:reindex
	```

3. Next let's deploy static content to make sure our parent themes are sent to `pub/static`, run this command from the site's root dir.

	```bash
	php bin/magento setup:static-content:deploy -f
	```

4. Finally for our first time compiling we'll need to install our node pacakges.

	```bash
	npm install
	```

5. Now let's compile.

	```bash
	gulp
	```

Wait, what's happening?
--

Blue Acorn's gulp process has been optimized to hit the ground running while minimizing the modifications we've made to native magento, keeping it performant and upgradable.  Now we'll go over what commands/technologies are available to you in gulp.

### Less Compilation
Less compilation can be achieved manually by typing `gulp less:themeName` (compile all themes that are configured with `gulp less:all`) where theme name in is your key form the `blueacornui/configs/_themes.js` `themes` variable.  If you wanted to compile the `site` theme less files, you would enter do the following from the command line:

#### Manual Commands

```bash
gulp less:site #Compiles the theme site's less

gulp less:all #Compiles all theme's less files
```

### Babel/ES6
We love ES6, so we wanted to make sure we could use some of it's features to write our code in a manor that we were happy with, just like less, our babel process looks for a source directory anywhere within app/code/BlueAcorn or app/design/frontend/BlueAcorn js directory.  It will then compile down without the source directory in it's path.  

Confused yet, here's a table with examples of where js files would compile down to.

**Standard Usage**

```bash
app/code/BlueAcorn/MegaMenu/view/frontend/web/js/source/menu-modals.js =>
app/code/BlueAcorn/MegaMenu/view/frontend/web/js/menu-modals.js
```

**Nested Sub-directories**

```bash
app/code/BlueAcorn/MegaMenu/view/frontend/web/js/source/view/brands/list.js =>
app/code/BlueAcorn/MegaMenu/view/frontend/web/view/brands/list.js
```

**Theme Usage**

```bash
app/design/frontend/BlueAcorn/site/web/js/source/preloader.js =>
app/design/frontend/BlueAcorn/site/web/js/preloader.js
```

**Source within Sub-directories**

```bash
app/design/frontend/BlueAcorn/site/Magento_Theme/web/js/frontend/test/source/test.js =>
app/design/frontend/BlueAcorn/site/Magento_Theme/web/js/frontend/test/test.js
```
#### Manul Commands

```bash
gulp babel:site #Compiles js for the theme site's js source files

gulp babel:all #Compiles js for all themes js source files
```

### SVG Sprites
Using grunt we can generate svg sprites on the fly for any svgs we put in a particular folder within our theme.  Within your theme you'll want to save any `svg`s you want sprited to `app/design/frontend/[Vendor]/[ThemeName]/web/spritesrc/` if your grunt watch is running it'll kick off to compile the svg sprite files as well as associated less partials.  If not whenever you run `grunt` or `grunt noexec` will also kick off the compilation.

#### Image Locations
`app/design/frontend/[Vendor]/[ThemeName]/web/images/sprites.svg`
`app/design/frontend/[Vendor]/[ThemeName]/web/images/sprites.view.svg`

#### Less Partial Locations
`app/design/frontend/[Vendor]/[ThemeName]/web/css/source/blueacorn/_sprites.less`
`app/design/frontend/[Vendor]/[ThemeName]/web/css/source/blueacorn/_sprites-view.less`

##### Sprites.View
`sprites.view` is the variation of svg sprites for use as background images within css. It's generated as a standard spritesheet with images placed on a grid, and shown with css as background images with width and height attributes applied to an element to crop out the other images.  

##### Sprites Use
`sprites` is the the variation of svg sprites for use with the svg `use` method within `html` markup.  Within the partial you will find classes that allow you to apply width & height dimensions to an `svg` element.

###### Usage Examples
In this example we're targeting an svg we uploaded called `logo.svg`.  We began by placing the svg image into `app/design/frontend/BlueAcorn/site/web/spritesrc/` it was processed by grunt and the sprite image and css partial is generated.

```php
<svg class="svg-logo-dims">
	<use xlink:href="<?php echo $block->getViewFileUrl('images/sprites.svg#logo')?>"></use>
</svg>
```

### PNG Sprites
Same concept as SVG sprites view it auto generates any `PNG`s you save into `app/design/frontend/BlueAcorn/site/web/spritesrc` into a sprite image found at `app/design/frontend/BlueAcorn/site/web/images/spritesheet.png` as well as a less partial with mixins/classes to be used at `app/design/frontend/BlueAcorn/site/web/css/source/blueacorn/_png-sprite.less`.

## Compiling & Watching

There are several options for compiling, made to be as easy as possible.

### Compile Everything, Watch It All

```bash
gulp
```

Runs the following commands:

1. `gulp exec:[themeName]` - Cleans Pub Static Directories for all sites in _themes.js that have `gulp: true` & creates symlinks to the source files.
2. `gulp clean:js` & `gulp clean:all` cleans out any compiled assets.
2. `gulp svg-site:all` & `gulp png-sprite:all` - Generates svg & png sprites sheets.
3. `gulp less:all`, `gulp imagemin:all` & `gulp eslint:all` - Compiles Less & Babel for the Theme, Minifies Images in app/design/frontend/[vendor]/[theme]/web/src to app/design/frontend/[vendor]/[theme]/web/images, validates theme js.
5. `grunt babel:all` - Compiles Babel from theme source directories.
6. `gulp exec:cache` - Clears caches.
6. `gulp watch` - Starts the file watchers.

### Compile Everything, without resymlinking it, Watch It All

```bash
grunt noexec
```
Runs the same commands as above sans the first one.
