#!/bin/bash

BUILD_DIR="../www"

npx expo export:web

rm -rf "$BUILD_DIR"

mkdir -p "$BUILD_DIR"
cp -R server/* "$BUILD_DIR/"

mv web-build/** "$BUILD_DIR/"

echo "Created $BUILD_DIR"
