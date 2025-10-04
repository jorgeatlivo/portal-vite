#!/bin/bash

FIX_FLAG=""
for arg in "$@"; do
  if [[ "$arg" == "--fix" ]]; then
    FIX_FLAG="--fix"
  fi
done

find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs -P 8 yarn eslint $FIX_FLAG --cache
