#!/bin/bash

# Create dist folder if it doesn't exist
mkdir -p dist

# Copy the necessary files and folders to dist
cp -r examples dist/
cp config.example.yaml dist/
cp -r config dist/
cp init.sh dist/
cp -r scripts dist/