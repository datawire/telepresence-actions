# telepresence-actions

Telepresence combined with GitHub Actions allows you to run integration tests in your CI pipeline without having to run any dependant service. By connecting to the target Kubernetes cluster, intercepting traffic to the remote service and sending it to an instance of the service running in CI you will be able to test bugfixes, updates and features very easily.

## V0

The V0 ediition of github actions for Telepresence contains individual actions to:

1. [Install](./install) the Telepresence binary in the Github runner.
1. [Connect](./connect) to a remote Kubernetes cluster.
1. [Log into Ambassador](./login) and create a [personal intercept](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#personal-intercept).
1. [Intercept](./intercept) traffic of service running in the K8s cluster and redirect it a service instance running in CI.


## Usage

The following is an example of a workflow that:

1. Checks out the repository code.
1. Has a placeholder step to run a service during CI.
1. Creates the /opt/kubeconfig file with the contents of the secrets.KUBECONFIG_FILE to make it available for Telepresence.
1. Installs Telepresence.
1. Runs Telepresence Connect.
1. Logs into Ambassador Telepresence.
1. Intercepts traffic to the service running in the remote cluster.
1. A placeholder for an action that would run integration tests, like making HTTP requests to your running service and verify it works while dependant services run in the remote cluster.

```yaml
  name: Run Integration Tests
  on:
    push:
      branches-ignore:
      - 'main'
  jobs:
    my-job:
      name: Run Integration Test using Remote Cluster
      runs-on: ubuntu-latest
      env:
        TELEPRESENCE_API_KEY: ${{ secrets.TELEPRESENCE_API_KEY }}
        KUBECONFIG_FILE: ${{ secrets.KUBECONFIG_FILE }}
        KUBECONFIG: /opt/kubeconfig
      steps:
      - name : Checkout
        uses: actions/checkout@v3
        with:
          ref: ${{ github.event.pull_request.head.sha }}
      #---- here run your custom command to run your service
      #- name: Run your service to test
      #  shell: bash
      #  run: ./run_local_service
      #----
      # First you need to log in to Telepresence, with your api key
      - name: Create kubeconfig file
        run: |
          cat <<EOF > /opt/kubeconfig
          ${{ env.KUBECONFIG_FILE }}
          EOF
      - name: Install Telepresence
        uses: datawire/telepresence-actions/install@v0.3
        with:
          version: 2.5.8 # Change the version number here according to the version of Telepresence in your cluster or omit this parameter to install the latest version
      - name: Telepresence connect
        uses: datawire/telepresence-actions/connect@v0.3
      - name: Login
        uses: datawire/telepresence-actions/login@v0.3
        with:
          telepresence_api_key: ${{ secrets.TELEPRESENCE_API_KEY }}
      - name: Intercept the service
        uses: datawire/telepresence-actions/intercept@v0.3
        with:
          service_name: service-name
          service_port: 8081:8080
          namespace: namespacename-of-your-service
          http_header: "x-telepresence-intercept-id=service-intercepted" # Custom HTTP header name and value that will identify traffic desired to go to the local service instace.
          print_logs: true # Flag to instruct the action to print out Telepresence logs and export an artifact with them
      #---- Run a custom command to run integration tests.
      #- name: Run integrations test
      #  shell: bash
      #  run: ./run_integration_test
      #----
```

