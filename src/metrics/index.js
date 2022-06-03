// const fs = require('fs');
const HttpClient = require("@actions/http-client").HttpClient
const AmbassadorClient = require('../ambassador/api-client');
const core = require('@actions/core');

const httpClient = new HttpClient();
const ambassadorClient = new AmbassadorClient(process.env.TELEPRESENCE_API_KEY)

class MetritonClient {
    static async sendMetricsReport(action){
        try {
            const reportDestination = 'https://metriton.datawire.io/beta/scout'
            const applicationName = 'telepresence-github-action-integration'
            const installId = '0.0.0-local' // fs.readFileSync(`${configureTP.getTelepresenceConfigPath()}/id`).toString()
            core.info('install id: ' + installId)
            const extensionVersion = '0.0.0-local'
            const pipelineId = process.env.GITHUB_RUN_ID
            core.info('pipelineId id: ' + installId)
            const accountInfo = await ambassadorClient.doRequestJson('/userinfo', null, 'GET')
            core.info('after do request')
            core.info('accountInfo id: ' + accountInfo.statusCode)
            core.info('accountInfo id: ' + accountInfo)
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
        } catch (err) {
            core.error("Error sending report to Metriton: " + err.message)
        }
        
    }
}



module.exports = MetritonClient
