#!/bin/bash

yarn ts-prune | while read line; do
    FILE=$(echo "$line" | cut -d':' -f1)
    SYMBOL=$(echo "$line" | awk '{print $3}')

    if ! grep -q -E "([^a-zA-Z0-9_])$SYMBOL([^a-zA-Z0-9_])" "$FILE"; then
        echo "$line"
    fi
done
