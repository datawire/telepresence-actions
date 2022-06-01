const core = require('@actions/core')
const exec = require('@actions/exec');
const MetritonClient = require('../metrics')

const telepresenceConnect = async function(){
    try {
        const metritonClient = new MetritonClient();
        metritonClient.sendMetricsReport('connect')
        await exec.exec('telepresence', ['connect']);
        core.saveState("telepresence_connected", true)
    } catch (error) {
        core.setFailed(error.message);
    }
}

telepresenceConnect();
