#!/bin/sh

# script used for building lambda zip

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "1 argument required, $# provided"

echo $1 | grep -E -q '^v((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$' || die "Invalid semantic format $1 provided"

npm run clean:lambda
mkdir lambda
cp -r dist/* lambda
cd lambda || exit 1
cp ../package.json .
npm i --production
rm package.json
rm package-lock.json
zip -r "lambda-$1.zip" .
rm -rf node_modules

# delete all file but the zip within current folder
mv *.zip ../
rm -rf *
mv ../*.zip .
