#!/bin/sh

PROJECT_HOME=$(pwd);
npm -v;
npm install recess connect uglify-js jshint express crypto istanbul -g;

cd ashlesha/public/static/bootstrap
make clean
make bootstrap

echo "Checking for couchdb"

couchdb

cd $PROJECT_HOME;

echo "Installing node modules "
npm install
