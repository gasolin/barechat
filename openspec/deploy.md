# Deployment Guide

This document outlines the process for publishing BareChat packages to the NPM registry.

## Prerequisites

1.  **NPM Account**: Ensure you have an account on [npmjs.com](https://www.npmjs.com/).
2.  **Login**: Log in to your NPM account via the terminal:
    ```bash
    npm login
    ```
3.  **Permissions**: Ensure you have the necessary permissions to publish to the `barechat` related package names.

## Publishing Workflow

Since this is a monorepo with interdependent packages, the order of publishing is critical.

### 1. Update Version Numbers

Update the version number in the `package.json` of the package you intend to publish. You can use `npm version`:

```bash
# Inside the package directory
npm version patch # or minor, or major
```

### 2. Publishing Order

Always publish the core package first if there are changes to it, as the CLI and Web packages depend on it.

1.  **`barechat-core`** (packages/core)
2.  **`barechat`** (packages/cli)
3.  **`barechat-web`** (packages/web)

### 3. Publishing Commands

For each package, navigate to its directory and run the publish command.

#### `barechat-core`
```bash
cd packages/core
npm publish --access public
```

#### `barechat` (CLI)
```bash
cd packages/cli
npm publish --access public
```

#### `barechat-web`
```bash
cd packages/web
npm publish --access public
```

## Special Considerations

### Peer Dependencies
Ensure that `barechat` and `barechat-web` refer to the correct version of `barechat-core` in their `dependencies` section before publishing.

### Tags
If you are publishing a beta or experimental version, use the `--tag` flag:
```bash
npm publish --tag beta --access public
```

### Pear Desktop App
`barechat-desktop` is currently designed for the Pear platform. Deployment for Pear involves generating a link and potentially sharing it via a P2P link rather than a traditional NPM registry at this stage.

```bash
cd packages/desktop
pear stage --dev # to stage changes
pear seed # to provide the app to others
```

## Automation

Currently, publishing is done manually per package. Future improvements may include using `lerna` or `changesets` for coordinated monorepo releases.
