const exec = require('@actions/exec')

const actionVersion = process.env.INPUT_ACTIONVERSION
exec.exec('/bin/bash -c', ['echo TELEPRESENCE_REPORT_GITHUB_ACTIONS_INTEGRATION=true >> $GITHUB_ENV'])
exec.exec('/bin/bash -c', [`echo ACTION_VERSION=${actionVersion} >> $GITHUB_ENV`])