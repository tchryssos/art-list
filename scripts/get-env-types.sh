#!/bin/bash

ENV_FILE="../.env"
OUTPUT_FILE="../src/typings/env.d.ts"

# Create the output directory if it doesn't exist
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Start the TypeScript declaration file
echo "declare namespace NodeJS {" >"$OUTPUT_FILE"
echo "  interface ProcessEnv {" >>"$OUTPUT_FILE"

# Read each line in the .env file
while IFS= read -r line; do
  # Ignore empty lines and comments
  if [[ ! -z "$line" && ! "$line" =~ ^# ]]; then
    # Extract the key from the line
    key=$(echo "$line" | cut -d '=' -f 1)
    # Add the key to the TypeScript declaration file
    echo "    $key: string;" >>"$OUTPUT_FILE"
  fi
done <"$ENV_FILE"

# Close the TypeScript declaration file
echo "  }" >>"$OUTPUT_FILE"
echo "}" >>"$OUTPUT_FILE"
