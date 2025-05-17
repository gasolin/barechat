#!/usr/bin/env node

import shell from 'shelljs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

// Get the directory of the current script in an ES module
const __filename = fileURLToPath(import.meta.url)
// Get the directory where this script is located, equivalent to __dirname
const scriptDir = path.dirname(__filename)

// Check if the bare command is available
if (!shell.which('bare')) {
  shell.echo('Error: bare command not found.')
  shell.echo('Please install bare globally using npm:')
  shell.echo('npm i -g bare')
  // Exit with a non-zero status code to indicate an error
  shell.exit(1)
}

// Go up one directory to get the project root
const projectRoot = path.dirname(scriptDir)

// The index.js should be in the project root
const indexPath = path.join(projectRoot, 'index.js')

// Pass any arguments given to the bin command to bare
// process.argv[0] is node, process.argv[1] is the script path
// We want to pass arguments starting from the third element
const bareArgs = [indexPath, ...process.argv.slice(2)]; // Pass arguments as an array
// console.log('>>> command:', bareArgs)

// Execute the bare command using child_process.spawn
const bareProcess = spawn('bare', bareArgs, {
  stdio: 'inherit', // This is crucial for TTY and readline to work
  shell: true // Use shell: true to allow the command to be found in PATH
})

// Handle process exit
bareProcess.on('close', (code) => {
  // Exit the parent process with the same code as the child process
  process.exit(code);
})

// Handle errors during process spawning
bareProcess.on('error', (err) => {
  console.error(`Failed to start bare process: ${err}`)
  process.exit(1); // Exit with error code
})
