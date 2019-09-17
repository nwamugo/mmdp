#!/usr/bin/env bash

# get branch name to deploy from .env
GIT_BRANCH=$(grep GIT_BRANCH .env | cut -d '=' -f 2-)
# clone branch to deploy from github
git clone -b $GIT_BRANCH git clone https://$GITHUB_USER:$GITHUB_PASS@github.com/viisaus/MMDP.git new-MMDP
# remove old version
rm -rf MMDP
# make new version current version
mv new-MMDP MMDP
# delete this script - hopefully it has completed its job :)
rm $0
