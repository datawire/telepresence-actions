const artifact = require('@actions/artifact');
const core = require('@actions/core');
const exec = require('@actions/exec');
const configure = require('../src/configure');
const MetritonClient = require('../src/metrics');

const telepresenceIntercept = async function () {
  const isConfigured = await configure.getConfiguration();
  if (!isConfigured) return;
  try {
    MetritonClient.sendMetricsReport('intercept');
    const service_name = core.getInput('service_name');
    const service_port = core.getInput('service_port');
    const namespace = core.getInput('namespace');
    const http_header = core.getInput('http_header');
    const env_file = core.getInput('env_file');
    const ingress_host = core.getInput('ingress_host');
    const ingress_port = core.getInput('ingress_port');
    const ingress_tls = core.getInput('ingress_tls');
    const ingress_l5 = core.getInput('ingress_l5');
    const print_logs = core.getInput('print_logs');
    const parameters = [
      'intercept',
      service_name,
      '--port',
      service_port,
      '--ingress-host',
      ingress_host,
      '--ingress-port',
      ingress_port,
      '--ingress-l5',
      ingress_l5,
      '-n',
      namespace,
      `--http-header=${http_header}`,
    ];
    if (env_file && env_file.length !== 0) {
      parameters.push('-e');
      parameters.push(env_file);
    }
    if (ingress_tls) parameters.push('--ingress-tls');

    await exec.exec('telepresence', parameters);
    core.saveState('telepresence_service_intercepted', true);

    if (print_logs) {
      await exec.exec('telepresence', ['gather-logs']);
      await exec.exec('unzip', ['telepresence_logs.zip', '-d', 'intercept-logs']);
      await exec.exec('cat', ['intercept-logs/cli.log']);
      await exec.exec('cat', ['intercept-logs/connector.log']);
      await exec.exec('cat', ['intercept-logs/daemon.log']);
      const artifactClient = artifact.create();
      await artifactClient.uploadArtifact('telepresence-logs', ['telepresence_logs.zip'], '.', {
        continueOnError: true,
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
};

telepresenceIntercept();
