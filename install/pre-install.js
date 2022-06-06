const exec = require('@actions/exec')

//set version by removing the v from vX.X.X, if it follows the format. if not, just return 0.0.0 
const semVerRegex = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/
const inputActionVersion = process.env.INPUT_ACTIONVERSION
const actionVersion = inputActionVersion && semVerRegex.test(inputActionVersion) ? inputActionVersion.shift() : '0.0.0'

exec.exec('/bin/bash -c', ['echo TELEPRESENCE_REPORT_GITHUB_ACTIONS_INTEGRATION=true >> $GITHUB_ENV'])
exec.exec('/bin/bash -c', [`echo ACTION_VERSION=${actionVersion} >> $GITHUB_ENV`])