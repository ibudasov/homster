#!/usr/bin/env bash

# It's possible to deploy AWS Lambda with dependencies only by uploading ZIP file.
# Sure, someone can do it manually, but here's my script. It's not perfect, but still work.

declare PROJECT_DIRECTORY="."

# making ZIP archive
zip -r homster_change.zip . > /dev/null

# and, actually, deploy
aws lambda update-function-code --function-name homster_change --zip-file fileb://${PROJECT_DIRECTORY}/homster_change.zip > /dev/null

# let's call it clean up
rm ${PROJECT_DIRECTORY}/homster_change.zip

echo Deployed.