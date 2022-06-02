const fs = require('fs/promises');
const HttpClient = require("@actions/http-client").HttpClient
const core = require('@actions/core');
const installTelepresence = require('../install');

const httpClient = new HttpClient()
const reportDestination = 'https://metriton.datawire.io/beta/scout'
const applicationName = 'telepresence-github-action-integration'
const installId = fs.readFileSync(`${installTelepresence.getTelepresenceConfigPath()}/id`).toString()
const extensionVersion = '0.0.0-local'
const pipelineId = process.env.GITHUB_RUN_ID

core.info('install id: ' + installId)

class MetritonClient {
    static sendMetricsReport(action){
        const payload = {
            application: applicationName,
            install_id: installId,
            version: extensionVersion,
            metadata: {
                action,
                pipelineId,
                userId: 'fakeuserId',
                accountId: 'fakeaccountId',
            },
        };
        httpClient.postJson(reportDestination, payload)
    }
}



module.exports = MetritonClient
