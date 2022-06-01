const core = require('@actions/core')
const exec = require('@actions/exec');
const MetritonClient = require('../src/metrics')

const telepresenceLogout = async function(){
    MetritonClient.sendMetricsReport('logout')
    const sessionCreated = core.getState('telepresence_session_created');
    if (!sessionCreated) {
        core.notice("Skipping logout. No telepresence session.");
        return;
    }

    try {
        await exec.exec('telepresence', ['logout']);
    } catch (error) {
        core.setFailed(error.message);
    }
}

telepresenceLogout();
