#!/bin/sh
set -e
# build an example project
TMP=`mktemp -d /tmp/fullstack.XXXXX`
cd "$TMP"
yo cljs-fullstack example
# test test
grunt test
# test dist
grunt
# test clean 
grunt clean
rm -rf "$TMP"