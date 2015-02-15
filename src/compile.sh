rm -rf engine.complete.js
find . -name '*.js' -exec cat {} \; > all.code
mv all.code engine.complete.js
