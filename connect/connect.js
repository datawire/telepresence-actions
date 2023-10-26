const core = require('@actions/core');
const exec = require('@actions/exec');
const configure = require('../src/configure');
const MetritonClient = require('../src/metrics');

const telepresenceConnect = async function () {
  const namespace = core.getInput('namespace');
  const isConfigured = await configure.getConfiguration();
  if (!isConfigured) return;
  try {
    MetritonClient.sendMetricsReport('connect');
    await exec.exec('telepresence', ['connect', "--namespace", namespace]);
    core.saveState('telepresence_connected', true);
  } catch (error) {
    core.setFailed(error.message);
  }
};

telepresenceConnect();
