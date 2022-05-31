const HttpClient = require("@actions/http-client").HttpClient


class MetritonClient {
    constructor() {
        this.reportDestination = 'https://metriton.datawire.io/beta/scout';
        this.applicationName = 'telepresence-github-action-integration';
        this.installId = '0.0.0-local'
        this.extensionVersion = '0.0.0-local';
        this.httpClient = new HttpClient() 
    }

    async sendMetricsReport(action){
        const payload = {
            application: this.applicationName,
            install_id: this.installId,
            version: this.extensionVersion,
            metadata: {
            action,
            },
        };
        httpClient.post(this.reportDestination, payload)
    }
}



module.exports = MetritonClient
