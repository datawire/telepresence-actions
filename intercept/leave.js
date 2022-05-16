const core = require('@actions/core')
const exec = require('@actions/exec');

const telepresenceLeave = async function(){
    try {
        const service_name = core.getInput('service_name');
        const namespace = core.getInput('namespace');
        await exec.exec('telepresence', ['leave',`${service_name}-${namespace}`]);
    } catch (error) {
        core.setFailed(error.message);
    }
}


telepresenceLeave();