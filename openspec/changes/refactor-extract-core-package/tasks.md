## 1. Core Package Creation
- [ ] 1.1 Create packages/core directory structure
- [ ] 1.2 Move chat-core.js to core package with updated imports
- [ ] 1.3 Create core package.json with appropriate dependencies
- [ ] 1.4 Create core package index.js and README.md
- [ ] 1.5 Update core package version and documentation

## 2. CLI Package Updates
- [ ] 2.1 Update CLI package.json to depend on barechat-core
- [ ] 2.2 Remove duplicate dependencies from CLI package
- [ ] 2.3 Update CLI exports.js to import from core package
- [ ] 2.4 Remove old chat-core.js from CLI package
- [ ] 2.5 Update CLI package documentation

## 3. Web Package Updates
- [ ] 3.1 Add barechat-core dependency to web package
- [ ] 3.2 Update web package imports to use core package
- [ ] 3.3 Test web package functionality with new dependencies
- [ ] 3.4 Update web package documentation

## 4. Validation and Testing
- [ ] 4.1 Verify CLI package functionality unchanged
- [ ] 4.2 Verify web package functionality unchanged
- [ ] 4.3 Test cross-package compatibility
- [ ] 4.4 Validate package dependencies and imports
- [ ] 4.5 Update monorepo workspace configuration if needed