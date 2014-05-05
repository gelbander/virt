## Assignment
  This is a work test

## Installation
  Since the json is loaded locally you need to open it with Firefox or with chrome in safe mode. This is how you do that (osx).

    open -a 'Google Chrome' --args -allow-file-access-from-files

  Open app/index.html

## Development
  Assuming nodejs and ruby is installed.
  The application requires bower, requirejs, sass and compass.

    npm install -g bower requirejs
    gem install sass compass

    bower install
    (The vendors are included for now. Anyway, they shouldn't).

## Build
  For distribution run:

    app/build/build.sh
