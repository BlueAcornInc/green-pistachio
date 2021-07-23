# Babel - ES6/TypeScript Compilation

> TODO: this is not directly accessible through `gpc` yet, and can only be triggered through other commands (`gpc compile`, `gpc watch`, `gpc default`)

We love ES6, so we wanted to make sure we could use some of its features to write our code in a manner that we're happy with, just like less, our babel process looks for a source directory anywhere within app/code or app/design/frontend js directories.  It will then compile down without the source directory in its path.

## Sources and Destinations

Confused yet?, here’s how it works:

[comment]: # (The table below was generated here: https://www.tablesgenerator.com/markdown_tables# It can be copy pasted into this generator for easy updating in the future)

## Modules

| Source                                                                                 | Destination                                                                     |
|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| `app/code/Vendor/Module/view/frontend/web/js/source/widget.js`                         | `app/code/Vendor/Module/view/frontend/web/js/widget.js`                         |

## Theme & Theme Modules

| Source                                                                                 | Destination                                                                     |
|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| `app/design/frontend/Vendor/theme/web/js/source/widget.js`                             | `app/design/frontend/Vendor/theme/web/js/widget.js`                             |
| `app/design/frontend/Vendor/theme/Magento_Theme/js/source/widget.js`                   | `app/design/frontend/Vendor/theme/Magento_Theme/js/widget.js`                   |

## Adminhtml

| Source                                                                                 | Destination                                                                     |
|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| `app/code/Vendor/Module/view/adminhtml/web/js/source/content-type/features/preview.js` | `app/code/Vendor/Module/view/adminhtml/web/js/content-type/features/preview.js` |

## Nested Directories

| Source                                                                                 | Destination                                                                     |
|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| `app/code/Vendor/Module/view/frontend/web/js/source/view/brands/list.js`               | `app/code/Vendor/Module/view/frontend/web/js/view/brands/list.js`               |
| `app/design/frontend/Vendor/theme/web/js/automated/test/source/test.js`                | `app/design/frontend/Vendor/theme/web/js/automated/test/test.js`                |

## Typescript

Want to use Typescript for your project, it's easy, just use `.ts` instead of `.js` and write your code in Typescript and instead of `source` place your code in a `ts` directory.

| Source                                                                             | Destination                                                                     |
|------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| `app/code/Vendor/Module/view/frontend/web/js/ts/widget.ts`                         | `app/code/Vendor/Module/view/frontend/web/js/widget.js`                         |
| `app/design/frontend/Vendor/theme/Magento_Theme/js/ts/widget.ts`                   | `app/design/frontend/Vendor/theme/Magento_Theme/js/widget.js`                   |
| `app/design/frontend/Vendor/theme/web/js/automated/test/ts/test.ts`                | `app/design/frontend/Vendor/theme/web/js/automated/test/test.js`                |

[comment]: # (End Table Generator Comment)
