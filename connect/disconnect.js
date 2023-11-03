const core = require('@actions/core');
const exec = require('@actions/exec');
//const MetritonClient = require('../src/metrics');

const telepresenceDisconnect = async function () {
  const connected = core.getState('telepresence_connected');
  if (!connected) {
    core.notice('Skipping disconnect. Telepresence was unable to connect.');
    return;
  }

  try {
    //MetritonClient.sendMetricsReport('disconnect');
    await exec.exec('telepresence', ['quit', '-s']);
  } catch (error) {
    core.setFailed(error.message);
  }
};

telepresenceDisconnect();
