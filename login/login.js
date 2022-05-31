const core = require('@actions/core')
const exec = require('@actions/exec');

const telepresenceLogin = async function(){
    try {
        const API_KEY = core.getInput('telepresence_api_key');
        await exec.exec('telepresence', ['login', '--apikey', API_KEY]);
        core.info(`TELEPRESENCE_REPORT_GITHUB_ACTION_INTEGRATION: 
        ${process.env['TELEPRESENCE_REPORT_GITHUB_ACTION_INTEGRATION']}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}


telepresenceLogin();