const core = require('@actions/core');
const exec = require('@actions/exec');
const configure = require('../src/configure');

const AmbassadorClient = require('../src/ambassador/api-client');
const MetritonClient = require('../src/metrics');

const telepresenceLogin = async function () {
  const isConfigured = await configure.getConfiguration();
  if (!isConfigured) return;
  const apiKey = core.getInput('telepresence_api_key');
  if (!apiKey) {
    core.setFailed(`telepresence_api_key is required`);
    return;
  }

  const ambassadorClient = new AmbassadorClient(apiKey);
  const keyValid = await ambassadorClient.isApiKeyValid();
  if (!keyValid) {
    core.setFailed('telepresence_api_key is expired or invalid');
    return;
  }

  try {
    MetritonClient.sendMetricsReport('login');
    await exec.exec('telepresence', ['login', '--apikey', apiKey]);
    core.saveState('telepresence_session_created', true);
  } catch (error) {
    core.setFailed(error.message);
  }
};

telepresenceLogin();
