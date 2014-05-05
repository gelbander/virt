# Build and compile
compass compile --output-style compressed --force
r.js -o app/build/app.build.js

# Cleanup

rm -rf dist/build dist/style/sass dist/scripts/views dist/scripts/models dist/scripts/collections dist/build.txt
ls dist/scripts/vendor | grep -v 'requirejs' | xargs -I '{}' rm -rf 'dist/scripts/vendor/{}'
