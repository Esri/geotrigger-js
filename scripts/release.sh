#!/bin/bash

# config
VERSION=$(node --eval "console.log(require('./package.json').version);")
NAME=$(node --eval "console.log(require('./package.json').name);")

# checkout temp branch for release
git checkout -b gh-release

# run build/test and exit if theres a problem
npm run build || exit 1

# force add files
git add dist -f

# commit changes with a versioned commit message
git commit -m "build $VERSION"

# push commit so it exists on GitHub when we run gh-release
git push upstream gh-release

# create a ZIP archive of the dist files
zip -r $NAME-v$VERSION.zip dist

# run gh-release to create the tag and push release to github
gh-release --assets $NAME-v$VERSION.zip

# checkout master and delete release branch locally and on GitHub
git checkout master
git branch -D gh-release
git push upstream :gh-release

# publish release on NPM
npm publish