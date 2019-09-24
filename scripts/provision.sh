#!/usr/bin/env bash

# get branch name to deploy from .env
GIT_BRANCH=$(grep GIT_BRANCH .env_provision | cut -d '=' -f 2-)
# clone branch to deploy from github
git clone -b $GIT_BRANCH git@github.com:viisaus/MMDP.git new-MMDP
# remove old version
rm -rf MMDP
# make new version current version
mv new-MMDP MMDP
# delete this script - hopefully it has completed its job :)
rm .env_provision
rm $0
