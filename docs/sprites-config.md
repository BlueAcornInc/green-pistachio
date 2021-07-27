## The `Sprites` Configuration

Within your `green-pistachio.config.js` you'll be able to configure SVG Sprites and PNG Sprites from within the`SVG Sprites` and `PNG Sprites` hooks.  SVG Sprites for Green Pistachio is powered by [gulp-svg-sprite](https://github.com/svg-sprite/gulp-svg-sprite) for SVG Sprites and  [gulp.spritesmith](https://www.npmjs.com/package/gulp-spritesmith) for PNG Sprites.  Available options for each of these can be found through those links.  Configuration can be applied to each project hook:

```javascript
project.hooks.gulp.svgSpriteConfig.tap('Green Pistachio - SVG Sprite', config => {
    config.svg.precision = 3;

    config.mode.view.prefix = '.s-'
});

project.hooks.gulp.svgSpriteConfig.tap('Green Pistachio - PNG Sprite', config => {
    config.cssName = 'web/css/source/_png-sprite.less';

    config.imgName = 'sprite.png'
});
```

Options for SVG Sprite can be found on in the [SVG Sprite Manual](https://github.com/svg-sprite/svg-sprite) and the PNG Sprite documentation can be found in the [spritesmith Documentation](https://github.com/twolfson/spritesmith).