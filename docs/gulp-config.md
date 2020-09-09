# Gulp Config

The `gulp-config.js` file informs Green Pistachio on the specifics of your 
project. Within the file, you will find an array of objects representative 
of each theme selected during the [Project Setup](project-setup.md)

Example: 

```
module.exports = [
    {
        "name": "luma",
        "gulp": true,
        "appPath": "frontend",
        "themePath": "Magento/luma",
        "locale": "en_US",
        "locales": [
            "en_US"
        ],
        "stylesheets": [
            "css/styles-m",
            "css/styles-l"
        ]
    }
];
```

The value/object tells gulp how to process your theme.

[comment]: # (The table below was generated here: https://www.tablesgenerator.com/markdown_tables# It can be copy pasted into this generator for easy updating in the future)

| Setting/Key | Options  | Description                                                                                                                                                                                   |
|-------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name        | String   | The name property is used to tell gulp about theme-specific commands. Best populated with a simple name, e.g. "site", "admin", "client                                                        |
| gulp        | Boolean  | Tells gulp tools whether or not the theme should be included in the workflow.                                                                                                                 |
| appPath     | String   | Scope of the theme in the workflow, if you have a normal front-end theme, you would populate this with frontend. If you are compiling an admin theme, you would populate this with adminhtml. |
| themePath   | String   | Path within app/design/{appPath}/ where you wish the workflow to process                                                                                                                      |
| locales     | String[] | The locales array is a list of locales you wish to compile your theme for, by default you should have at least one, in the example above we have en_US which is the Blue Acorn iCi default.   |
| stylesheets | String[] | Array of parent stylesheets that you wish to compile from less to css. Examples: css/styles-m css/styles-l Vendor_Module::css/styles                                                          |

[comment]: # (End Table Generator Comment)