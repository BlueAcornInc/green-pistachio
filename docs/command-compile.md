# Compile Only Command

```
gpc compile
```

Runs the following commands:

1. SVG Sprite & PNG Sprite generation in parallel for active themes.
2. Image Minifaction & ESLint for active themes, and ESLint for `app/code` in parallel.
3. Babel for active themes, and Babel for modules `app/code` in parallel.
4. Less Compilation for active themes.