import fs from 'bare-fs'
import path from 'bare-path'

const defaultStorePath = './barechat.txt'

// A simple command-line argument parser
export function parseArgs(argv) {
  const result = { topic: '', store: null, bootstrap: null }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg === '--store') {
      // Handle --store option without value (use default)
      if (i + 1 >= argv.length || argv[i + 1].startsWith('--')) {
        result.store = defaultStorePath
      } else {
        // Handle --store with value
        result.store = argv[i + 1]
        i++ // Skip the next argument as it's the value
      }
    } else if (arg.startsWith('--store=')) {
      // Handle --store=path format
      const value = arg.substring('--store='.length)
      result.store = value || defaultStorePath
    } else if (arg === '--bootstrap') {
      // Handle --bootstrap option with value
      if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        result.bootstrap = argv[i + 1]
        if (value) { // Ensure value is not empty string
          if (result.bootstrap === null) { // Initialize array if null
            result.bootstrap = []
          }
          result.bootstrap.push(...value.split(','))
        }
        i++ // Skip the next argument as it's the value
      } else {
        // If --bootstrap is the last arg or next arg starts with '--'
        // value is still null or existing array
      }
    } else if (arg.startsWith('--bootstrap=')) {
      // Handle --bootstrap=path format
      const value = arg.substring('--bootstrap='.length)
      if (value) { // Ensure value is not empty string
        if (result.bootstrap === null) { // Initialize array if null
          result.bootstrap = []
        }
        result.bootstrap.push(...value.split(','))
      }
    } else if (!arg.startsWith('--') && !result.topic) {
      // First non-option argument is treated as the topic
      result.topic = arg
    }
  }
  return result
}

class FileStore {
  constructor(storePath = null) {
    // If storePath is null, storage is disabled
    this.storePath = storePath
    this.currentRoomLog = null

    // Only initialize storage if path is provided
    if (this.storePath) {
      this.initializeStorage()
    }
  }

  initializeStorage() {
    try {
      // Handle file path
      const dirPath = path.dirname(this.storePath)

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
    } catch (error) {
      console.error(`[error] Failed to create storage directory: ${error.message}`)
    }
  }

  setupLogFile(topic) {
    if (!this.storePath) {
      return false; // Storage is disabled
    }

    this.closeLogFile() // Close any existing log file

    try {
      // Write header to the log file
      const header = `=== Chat session started at ${new Date().toLocaleString()} ===\n` +
                    `=== Room: ${topic} ===\n\n`

      // Either create new file or append to existing file
      if (fs.existsSync(this.storePath)) {
        fs.appendFileSync(this.storePath, '\n' + header);
      } else {
        fs.writeFileSync(this.storePath, header);
      }

      this.currentRoomLog = this.storePath;
      console.log(`[info] Chat log will be saved to ${this.storePath}`)
      return true
    } catch (error) {
      console.error(`[error] Failed to set up log file: ${error.message}`)
      this.currentRoomLog = null
      return false
    }
  }

  saveMessage(memberId, message) {
    // Save message to log file if enabled
    if (this.currentRoomLog) {
      const timestamp = new Date().toISOString()
      const logEntry = `[${timestamp}] [${memberId}] ${message}\n`

      try {
        fs.appendFileSync(this.currentRoomLog, logEntry)
        return true
      } catch (error) {
        console.error(`[error] Failed to write to log file: ${error.message}`)
        return false
      }
    }
    return false
  }

  closeLogFile() {
    if (this.currentRoomLog) {
      try {
        const footer = `\n=== Chat session ended at ${new Date().toLocaleString()} ===\n`
        fs.appendFileSync(this.currentRoomLog, footer)
        console.log(`[info] Chat log saved to ${this.currentRoomLog}`)
        const logPath = this.currentRoomLog
        this.currentRoomLog = null
        return logPath
      } catch (error) {
        console.error(`[error] Failed to close log file: ${error.message}`)
        this.currentRoomLog = null
        return null
      }
    }
    return null
  }

  isEnabled() {
    return !!this.currentRoomLog
  }
}

export function createFileStore(storePath) {
  return new FileStore(storePath)
}
