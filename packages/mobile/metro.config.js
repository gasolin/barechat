const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace root
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages from
// config.resolver.nodeModulesPaths = [
//     path.resolve(projectRoot, 'node_modules'),
//     path.resolve(workspaceRoot, 'node_modules'),
// ];

config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    events: require.resolve('bare-events'),
};

module.exports = config;
