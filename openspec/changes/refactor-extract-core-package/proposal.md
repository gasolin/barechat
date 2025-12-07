# Change: Extract Core Package for Reusable P2P Chat Functionality

## Why
To eliminate code duplication between CLI and web packages by extracting shared P2P networking logic into a reusable core package, improving maintainability and enabling easier development of new BareChat interfaces.

## What Changes
- Create new `barechat-core` package containing shared P2P networking functionality
- Move `chat-core.js` from CLI package to core package
- Update CLI package to depend on and import from core package
- Update web package to depend on core package directly
- Remove duplicate dependencies from CLI package
- **BREAKING**: Change import path from `barechat/lib/chat-core` to `barechat-core`

## Impact
- Affected specs: cli, web (new core spec to be created)
- Affected code: packages/cli/lib/chat-core.js, packages/cli/lib/exports.js, packages/web/index.js, package.json files
- New package: packages/core with independent versioning and publishing