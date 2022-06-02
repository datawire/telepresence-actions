const install = require('../src/install');
const MetritonClient = require('../src/metrics')

install.telepresenceInstall();
MetritonClient.sendMetricsReport('install')
