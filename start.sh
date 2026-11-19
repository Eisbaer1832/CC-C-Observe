#!/bin/bash
export NVM_DIR=~/.nvm
source $NVM_DIR/nvm.sh
nvm use 26
node app.js --experimental-sqlite
