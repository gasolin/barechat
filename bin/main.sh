#!/bin/bash

# Check if the bare command is available
if ! command -v bare &> /dev/null
then
    echo "Error: bare command not found." >&2
    echo "Please install bare globally using npm:" >&2
    echo "npm i -g bare" >&2
    # Exit with a non-zero status code to indicate an error
    exit 1
fi

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Go up one directory to get the project root
PROJECT_ROOT="$( dirname "$SCRIPT_DIR" )"
# The index.js should be in the project root
INDEX_PATH="$PROJECT_ROOT/barechat/index.js"

# "$@" will pass any arguments given to the bin command
bare "$INDEX_PATH" "$@"
