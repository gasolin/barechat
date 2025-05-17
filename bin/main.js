#!/usr/bin/env node

import shell from 'shelljs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory of the current script in an ES module
const __filename = fileURLToPath(import.meta.url)
// Get the directory where this script is located
// __dirname equivalent
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

// The index.js should be in the project root/barechat
const indexPath = path.join(projectRoot, 'barechat', 'index.js')

// Pass any arguments given to the bin command to bare
// process.argv[0] is node, process.argv[1] is the script path
// We want to pass arguments starting from the third element
const args = process.argv.slice(2).join(' ')

// Execute the bare command
// Use shell.exec with { fatal: true } to exit if the command fails
// Use { async: true } and pipe stdout/stderr to inherit output
const command = `bare "${indexPath}" ${args}`

// Execute the command and inherit stdio
shell.exec(command, { fatal: true, stdio: 'inherit' })
