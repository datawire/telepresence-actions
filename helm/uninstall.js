const core = require('@actions/core');
const exec = require('@actions/exec');
//const MetritonClient = require('../src/metrics');
const { stateKey } = require('./install');

const telepresenceHelmUninstall = async function () {
  const connected = core.getState(stateKey);
  if (!connected) {
    core.notice('Skipping uninstall. Telepresence was unable to be installed.');
    return;
  }

  try {
    //MetritonClient.sendMetricsReport('helm_uninstall');
    await exec.exec('telepresence', ['helm', 'uninstall']);
  } catch (error) {
    core.setFailed(error.message);
  }
};

telepresenceHelmUninstall();
