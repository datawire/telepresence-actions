const core = require('@actions/core')
const exec = require('@actions/exec');

const telepresenceConnect = async function(){
    try {
        await exec.exec('telepresence', ['connect']);
    } catch (error) {
        core.setFailed(error.message);
    }
}


telepresenceConnect();