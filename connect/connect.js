const core = require('@actions/core')
const exec = require('@actions/exec');

const telepresenceConnect = async function(){
    try {
        await exec.exec('telepresence', ['connect']);
        core.saveState("telepresence_connected", true)
    } catch (error) {
        core.setFailed(error.message);
    }
}

telepresenceConnect();
