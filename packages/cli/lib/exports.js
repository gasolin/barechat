// Export core chat functionality
export { getBackend, createMessage } from 'barechat-core'

// Export helper utilities
export { createFileStore, parseArgs } from './helper.js'

// Export RPC server for use in other packages
export { RPCServer, SOCKET_PATH } from './rpc-server.js'

// Export API constants
export * from './api.js'