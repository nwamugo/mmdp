#!/usr/bin/env bash

if [ "$CIRCLE_BRANCH" == master ]; then
    # set production env variables and server
    #SERVER_IP=$PROD_IP
    DEPLOY_ENV=production
else
    # set staging env variables and server
    #SERVER_IP=$STAG_IP
    DEPLOY_ENV=staging
fi

echo "GIT_BRANCH"=$(echo $CIRCLE_BRANCH) >> .env_provision
echo "DEPLOY_ENV"=$(echo $DEPLOY_ENV) >> .env_provision

ssh-keyscan $SERVER_IP >> ~/.ssh/known_hosts

# create deploy folder if it does not exist
ssh $DEPLOY_USER@$SERVER_IP "mkdir -p ${DEPLOY_ENV}"
# copy provision.sh to server
# provision.sh stops pm2, removes existing work, clones repo, builds app and starts pm2
scp scripts/provision.sh $DEPLOY_USER@$SERVER_IP:/home/$DEPLOY_USER/$DEPLOY_ENV/provision.sh
# copy .env to server
# .env will be used when building and cloning the app
scp .env_provision $DEPLOY_USER@$SERVER_IP:/home/$DEPLOY_USER/$DEPLOY_ENV/.env_provision
# trigger provision.sh
ssh $DEPLOY_USER@$SERVER_IP "cd ${DEPLOY_ENV} && chmod +x provision.sh && screen -dm bash -c './provision.sh > provision.log'"
