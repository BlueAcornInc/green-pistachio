# Webpack Build Command

This command will run webpack in production mode, and emit compiled assets into the pub/static directory for all themes and locales.

```
gpc webpack:build
```

## How to configure on Magento Cloud

To have this command run automatically on Magento Cloud, you'll need to modify the default build hook in the `.magento.app.yaml` file. The general goal is to install a modern version of node, install dependencies, and execute the webpack build command.

Example:
```
hooks:
    # We run build hooks before your application has been packaged.
    build: |
        php ./vendor/bin/ece-tools run scenario/build/generate.xml

        set -e
        unset NPM_CONFIG_PREFIX
        curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.35.1/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh"  ] && \. "$NVM_DIR/nvm.sh"
        nvm install --lts=erbium

        npm install
        NODE_ENV=production npm run gpc webpack:build

        php ./vendor/bin/ece-tools run scenario/build/transfer.xml
    # We run deploy hook after your application has been deployed and started.
    deploy: |
        php ./vendor/bin/ece-tools run scenario/deploy.xml
    # We run post deploy hook to clean and warm the cache. Available with ECE-Tools 2002.0.10.
    post_deploy: |
        php ./vendor/bin/ece-tools run scenario/post-deploy.xml
```