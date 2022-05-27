const core = require('@actions/core')
const exec = require('@actions/exec');

const telepresenceDisconnect = async function(){
    const connected = core.getState('telepresence_connected');
    if (!connected) {
        core.notice("Skipping disconnect. Telepresence was unable to connect.");
        return;
    }

    try {
        await exec.exec('telepresence', ['quit']);
    } catch (error) {
        core.setFailed(error.message);
    }
}


telepresenceDisconnect();
