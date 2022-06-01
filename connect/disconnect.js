const core = require('@actions/core')
const exec = require('@actions/exec');
const MetritonClient = require('../src/metrics')

const telepresenceDisconnect = async function(){
    MetritonClient.sendMetricsReport('disconnect')
    const connected = core.getState('telepresence_connected');
    if (!connected) {
        core.notice("Skipping disconnect. Telepresence was unable to connect.");
        return;
    }

    try {
        await exec.exec('telepresence', ['quit', '-ur']);
    } catch (error) {
        core.setFailed(error.message);
    }
}


telepresenceDisconnect();
