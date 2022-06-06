const exec = require('@actions/exec')

const actionVersion = process.env.ACTIONVERSION
exec.exec('/bin/bash -c', ['echo TELEPRESENCE_REPORT_GITHUB_ACTIONS_INTEGRATION=true >> $GITHUB_ENV'])
exec.exec('/bin/bash -c', [`echo ACTIONVERSION=t${actionVersion} >> $GITHUB_ENV`])