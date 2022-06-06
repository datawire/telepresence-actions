const install = require('../src/install');
const exec = require('@actions/exec')


exec.exec('echo "TELEPRESENCE_GITHUB_ACTION_INTEGRATION=true" >> $GITHUB_ENV')
install.telepresenceInstall();
