#!/usr/bin/env bash

# get branch to deploy and deploy env
GIT_BRANCH=$(grep GIT_BRANCH .env_provision | cut -d '=' -f 2-)
DEPLOY_ENV=$(grep DEPLOY_ENV .env_provision | cut -d '=' -f 2-)
# clone branch to deploy from github
git clone -b $GIT_BRANCH git@github.com:viisaus/MMDP.git new-MMDP
# remove old version
rm -rf MMDP
# make new version current version
mv new-MMDP MMDP
# supervisor restart
supervisorctl restart run-${DEPLOY_ENV}-site
# delete this script - hopefully it has completed its job :)
rm .env_provision
rm $0
