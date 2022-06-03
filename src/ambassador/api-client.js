const HttpClient = require("@actions/http-client").HttpClient
const core = require('@actions/core');

class AmbassadorClient {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("telepresence api key is required");
        }
        this.apiKey = apiKey;
        this.baseURL = "https://app.getambassador.io/cloud/api"
        this.httpClient = new HttpClient('ambassador', null, {
            'allowRedirects': false,
            headers: { 'X-Ambassador-API-Key': this.apiKey }
        })
    }

    async isApiKeyValid()  {
        const response = await this.doRequest('/userinfo');
        if (response.message.statusCode !== 200) {
            return false;
        }
        return true;
    }

    async doRequest(endpoint, data, method, additionalHeaders) {
        return this.httpClient.request(
            method || 'GET',
            this.baseURL + endpoint, 
            data,
            additionalHeaders || {}
        );
    }

    async doRequestJson(endpoint, data, method = 'GET', additionalHeaders) {
        if (method === 'GET') {
            return this.httpClient.getJson(
                this.baseURL + endpoint, 
                additionalHeaders || {}
            );
        }
        return this.httpClient[`${method.toLowerCase()}Json`](
            this.baseURL + endpoint,
            data,
            additionalHeaders || {}
        );
    }
}

module.exports = AmbassadorClient;
