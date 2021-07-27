## The `Image Optimization` Configuration

First off we only support options for `SVGO` configuration, we have left `gifsicle`, `mozjpeg`, and `optipng` with their current options and have no plans currently to extend them.  Within your `green-pistachio.config.js` you'll be ahble to configure SVGO from within the `SVGO` hook.  Imagemin for Green Pistachio is powered by [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin) and uses [imagemin-svgo](https://www.npmjs.com/package/imagemin-svgo), [imagemin-gifcicle](https://www.npmjs.com/package/imagemin-gifsicle), [imagemin-mozjpeg](https://www.npmjs.com/package/imagemin-mozjpeg), and [imagemin-optipng](https://www.npmjs.com/package/imagemin-optipng).  ONLY SVGO CAN BE CONFIGURED IN `green-pistachio.config.js` and it's options can be found at [svgo](https://github.com/svg/svgo#configuration).

```javascript
project.hooks.gulp.svgoConfig.tap('Green Pistachio - SVGO', config => {
    config.inlineStyles = false;

    config.removeUselessStrokeAndFill = false;
});
```

Add any of the options below to configure, you would do so by adding config.`{OptionName}` and value to the hook above, again these
are just example options from [svgo](https://github.com/svg/svgo#configuration), it's [documentation](https://github.com/svg/svgo) should be a more complete reference.
