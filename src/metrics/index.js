// const fs = require('fs');
const HttpClient = require("@actions/http-client").HttpClient
const AmbassadorClient = require('../ambassador/api-client');

const httpClient = new HttpClient();
const ambassadorClient = new AmbassadorClient(process.env.TELEPRESENCE_API_KEY)

const reportDestination = 'https://metriton.datawire.io/beta/scout'
const applicationName = 'telepresence-github-action-integration'
const installId = '0.0.0-local' // fs.readFileSync(`${configureTP.getTelepresenceConfigPath()}/id`).toString()
const extensionVersion = '0.0.0-local'
const pipelineId = process.env.GITHUB_RUN_ID
const accountInfo = ambassadorClient.doRequestJson('/userInfo', null, 'GET')

core.info('install id: ' + installId)
core.info('pipelineId id: ' + installId)
core.info('accountInfo id: ' + accountInfo.body)

class MetritonClient {
    static sendMetricsReport(action){

        const payload = {
            application: applicationName,
            install_id: installId,
            version: extensionVersion,
            metadata: {
                action,
                pipelineId,
                userId: accountInfo.userId,
                accountId: accountInfo.accountId
            },
        };
        httpClient.postJson(reportDestination, payload)
    }
}



module.exports = MetritonClient
