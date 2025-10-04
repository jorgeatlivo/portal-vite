#!/bin/bash

npx ts-prune | grep -v 'used in module' | grep -v 'src/app/'
