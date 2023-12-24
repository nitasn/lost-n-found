#!/bin/bash

BUILD_DIR="../www"

npx expo export:web
rm -rf server/web-build/
mv web-build "server/web-build"

mkdir -p "$BUILD_DIR"

# delete all contents of the build directory EXCEPT for the .git subdir
find "$BUILD_DIR" -mindepth 1 -not -path "$BUILD_DIR/.git*" -exec rm -rf {} +

cp -R server/* "$BUILD_DIR/"

echo "
.DS_Store
.env
node_modules/
" > "$BUILD_DIR/.gitignore"

cd "$BUILD_DIR"
git add .
git commit -am "automatic deploy @ `date +%H:%M:%S_%D`"
git push

echo "'$BUILD_DIR' was created and deployed."
