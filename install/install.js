const install = require('../src/install');
const MetritonClient = require('../src/metrics')

MetritonClient.sendMetricsReport('install')
install.telepresenceInstall();
