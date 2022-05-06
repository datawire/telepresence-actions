# telepresence-actions
Intercept your remote service with Telepresence

## V0
The V0 edition of the action offers:
- Create a personal intercept of a remote server.
- Set a header to only intercept the specific traffic.
- Disconnect Telepresence from the remote cluster.
- Only works with the ambassador ingress services, see.
- Requires context propagation to  intercept the traffic, see.
- Login using an API key, see.

## Usage
```yaml
# First you need to log in to Telepresence, with your api key
- name: Connect to Remote Cluster
  uses: datawire/development-telepresence-intercept@v0
  with:
    # Static API key to use instead of performing an interactive login
    telepresence_api_key: ${{ env.TELEPRESENCE_API_KEY }}
    # The name of the service to intercept
    service_name: voting
    # The port of the service to intercept
    service_port: 8081:8080
    # The configuration of the remote cluster
    kubeconfig_file: ${{ env.KUBECONFIG_FILE }}
    # If present, the namespace scope for this CLI request
    namespace: emojivoto
    # Only intercept traffic that matches this "HTTP2_HEADER=REGEXP" specifier
    http_header: "x-telepresence-intercept-id=service-intercepted"
#---- here run your custom command
#- name: Run integrations test
#  shell: bash
#  run: ./run_integration_test
#----
# Finally run the disconnect action to remove the intercept created
- name: Disconnect Telepresence
  uses: datawire/development-telepresence-intercept/disconnect@v0
```

