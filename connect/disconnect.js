const core = require('@actions/core')
const exec = require('@actions/exec');
const MetritonClient = require('../metrics')

const telepresenceDisconnect = async function(){
    const metritonClient = new MetritonClient();
    metritonClient.sendMetricsReport('disconnect')
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
