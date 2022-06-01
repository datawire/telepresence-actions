const core = require('@actions/core')
const exec = require('@actions/exec');
const MetritonClient = require('../src/metrics')

const telepresenceLeave = async function(){
    MetritonClient.sendMetricsReport('leave')
    if (!core.getState('telepresence_service_intercepted')) {
        core.notice("Skipping 'telepresence leave'. No intercept detected.");
        return;
    }

    try {
        const service_name = core.getInput('service_name');
        const namespace = core.getInput('namespace');
        await exec.exec('telepresence', ['leave',`${service_name}-${namespace}`]);
    } catch (error) {
        core.setFailed(error.message);
    }
}


telepresenceLeave();
