#!/usr/bin/env bash

# It's possible to deploy AWS Lambda with dependencies only by uploading ZIP file.
# Sure, someone can do it manually, but here's my script. It's not perfect, but still work.

# I assume this script is placed in project root directory
PROJECT_DIRECTORY = pwd

# symlink to proper index file to have back compartibility with Apex
rm ${PROJECT_DIRECTORY}index.js
ln ${PROJECT_DIRECTORY}functions/change/index.js  ${PROJECT_DIRECTORY}index.js

# making ZIP archive
zip -r homster_change.zip .

# and, actually, deploy
aws lambda update-function-code --function-name homster_change --zip-file fileb://${PROJECT_DIRECTORY}homster_change.zip

# let's call it clean up
rm ${PROJECT_DIRECTORY}index.js
rm ${PROJECT_DIRECTORY}homster_change.zip