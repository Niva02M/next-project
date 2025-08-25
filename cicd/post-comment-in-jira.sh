#!/bin/bash 
set -e

LOG_FILE="/home/ebthemes/dev/validate_service.log"
#LOG_FILE="$(pwd)/test.log"
# touch "/home/ebthemes/dev/validate_service.log"

if [ -z "$LOG_FILE" ]; then
  echo "LOG_FILE is not set"
else
  echo "[$(date)] ===== Starting ValidateService ====="   >> $LOG_FILE
fi


echo "test " >> $LOG_FILE


echo "[$(date)] ======= Automation Triggre Started ======" >> $LOG_FILE

#trigger bitbucket test pipeline
BITBUCKET_IDENTITY="$(aws ssm get-parameter --with-decryption  --output text --query 'Parameter.Value' --name B_IDENTITY | base64 -d )"
BITBUCKET_REPO_SLUG="$(aws ssm get-parameter --with-decryption  --output text --query 'Parameter.Value' --name BITBUCKET_REPO_SLUG | base64 -d )"

CURRENT_REPO="ebthemes-web"
LATEST_BRANCH=$(
  curl --location \
    "https://api.bitbucket.org/2.0/repositories/ebpearls28/$CURRENT_REPO/pullrequests?q=destination.branch.name%3D%22dev%22%20AND%20state%3D%22MERGED%22&sort=-updated_on&pagelen=1" \
    --header "Content-Type: application/json" \
    --header "Authorization: Basic $BITBUCKET_IDENTITY" \
    | python3 -c "
import sys, json
data = json.load(sys.stdin)
if data.get('values'):
    print(data['values'][0]['source']['branch']['name'])
"
)

echo "Latest merged Branch":$LATEST_BRANCH >> $LOG_FILE

JIRA_ISSUE_KEY=$(echo "$LATEST_BRANCH" | grep -oE '[A-Z]{2,10}-[0-9]+' | head -n1)
echo "Jira Issue Attached:"$JIRA_ISSUE_KEY >> $LOG_FILE

if [[ -n "$JIRA_ISSUE_KEY" ]]; then
  echo "Found Jira issue key: $JIRA_ISSUE_KEY"
  echo "[$(date)] ===== Jira issue key is : $JIRA_ISSUE_KEY ====="   

  curl --location "https://api.bitbucket.org/2.0/repositories/ebpearls28/$BITBUCKET_REPO_SLUG/pipelines" \
  --header 'Content-Type: application/json' \
  --header "Authorization: Basic $BITBUCKET_IDENTITY" \
  --data "{
          \"target\": {
            \"ref_type\": \"branch\",
            \"type\": \"pipeline_ref_target\",
            \"ref_name\": \"main\"
          },
          \"variables\": [
            {
              \"key\": \"BRANCH_NAME\",
              \"value\": \"${JIRA_ISSUE_KEY}\"
            }
          ]
        }"
else
  echo "No Jira issue key found in branch. Exiting..."  >> $LOG_FILE
  exit 0
fi



echo "[$(date)] ======= Automation Triggred End ======" >> $LOG_FILE





