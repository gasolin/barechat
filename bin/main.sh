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

# "$@" will pass any arguments given to the bin command
bare index.js "$@"
