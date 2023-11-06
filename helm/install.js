const core = require('@actions/core');
const exec = require('@actions/exec');
const { stateKey } = require('./models');
//const configure = require('../src/configure');
//const MetritonClient = require('../src/metrics');

const telepresenceHelmInstall = async function () {
  //const isConfigured = await configure.getConfiguration();
  //if (!isConfigured) return;
  try {
    //MetritonClient.sendMetricsReport('helm_install');
    await exec.exec('telepresence', ['helm', 'install']);
    core.saveState(stateKey, true);
  } catch (error) {
    core.setFailed(error.message);
  }
};

telepresenceHelmInstall();
