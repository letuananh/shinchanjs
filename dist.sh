#!/bin/bash

if [ ! -d dist ]; then
    mkdir dist
fi

git archive --format zip --output dist/code-dev.zip dev
ls -l dist/
