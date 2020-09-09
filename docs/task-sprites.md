# SVG/PNG Sprites

Using Green Pistachio we can generate SVG sprites on the fly for any SVG we put in a particular folder within your theme.  Within your theme, you’ll want to save any SVG you want in the sprite sheet to `app/design/frontend/Vendor/theme/web/spritesrc/`.  If you are compiling w/ `gpc compile` or running `gpc watch` it will generate an SVG sprite sheet, and less partial to be included with your theme.

## Image Locations

SVG images located in `app/design/frontend/Vendor/theme/web/spritesrc/` will be compiled into a sprite sheet in `app/design/frontend/Vendor/theme/web/src/spritesheet.svg` which will then be minified using imagemin and place in `app/design/frontend/Vendor/theme/web/images/spritesheet.svg`.

## Less Partial Locations

LESS partials will be generated and placed in `app/design/frontend/Vendor/theme/web/css/source/blueacorn/_sprites.less` unless you’re using the default Blue Acorn theme, you will need to include this partial manually into your theme.

## Sprites Usage

The LESS partial will contain variables and mixins for use in your theme.  Each of the original SVGs will have the following created for it.

```
// All of these assume that the SVG file was named `sprite-name.svg`

// Global Mixins & Variables
// -------------------------

@sprite-url: "../images/sprites.svg"; // Spritesheet SVG location.
@sprite-width: 100px; // Spritesheet total width.
@sprite-height: 100px; // Spritesheet total height.

.svg() {
    background-image: url("@{sprite-url}");
    background-repeat: no-repeat;
}

// SVG Specific Mixins
// In the examples assume the SVG file was named `sprite-name.svg`
// -------------------------

// X position Variable
@svg-sprite-name-x: 0;

// Y position Variable
@svg-sprite-name-y: 0;

// XY position Variable
@svg-sprite-name-xy: 0 0;

// Width Variable
@svg-sprite-name-width: 10px;

// Height Variable
@svg-sprite-name-height: 8px;

// Mixin that assigns background-position for the Sprite
.svg-sprite-name() {
  background-position: @svg-sprite-name-xy;
}

// Mixin that assigns dimensions for the Sprite
.svg-sprite-name-dims() {
  width: @svg-sprite-name-width;
  height: @svg-sprite-name-height;
}

// Mixin that assigns all mixins for a particular sprite.  (Notice the prefix svgi)
.svgi-sprite-name() {
  .svg();
  .svg-sprite-name();
  .svg-sprite-name-dims();
}

// Class generated for a particular icon, usable in the DOM.
& when (@media-common = true) {
  .svg-sprite-name {
    .svgi-sprite-name();
  }
}
```

## PNG Sprites

Same concept as the SVG sprites, by saving PNG into `app/design/frontend/Vendor/theme/web/spritesrc/` during gulp compile or gulp watch a spritesheet will be generated in `app/design/frontend/Vendor/theme/web/src/spritesheet.png` which will be minified using imagemin and placed in `app/design/frontend/Vendor/theme/web/images/spritesheet.png`. The LESS partial will be generated `app/design/frontend/Vendor/theme/web/css/source/blueacorn/_png-sprite.less`. 