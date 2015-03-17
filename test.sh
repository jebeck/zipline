#!/bin/bash

echo ""
echo "/=*=*= JEST =*=*=/"
echo ""
echo ""
node_modules/.bin/jest
echo ""
echo ""
echo "/=*=*= MOCHA =*=*=/"
node_modules/.bin/mocha test/**/*_test.js
node_modules/.bin/mocha diabetes/test/**/*_test.js
echo ""