import { getDefaultConfig } from 'expo/metro-config';
import path from 'path';

const projectRoot = new URL('.', import.meta.url).pathname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// Let Metro know where to resolve packages within the monorepo
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Exclude peer dependencies from other packages
config.resolver.alias = {
  'barechat': path.resolve(workspaceRoot, 'packages/cli'),
  'barechat-rpc': path.resolve(workspaceRoot, 'packages/rpc'),
};

export default config;