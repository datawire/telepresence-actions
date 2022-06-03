# Telepresence configure action

The Telepresence configure action installs the binary and creates a cache entry with the contents of the Telepresence configuration directory which includes the Telepresence install ID obtained after connecting and the user's configuration file (optional). Read this [GitHub article](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows) for more information about GitHub actions cache and its restrictions.


You can provide a Telepresence [client configuration file](https://www.getambassador.io/docs/telepresence/latest/reference/config/#values) to customize the behavior of Telepresence when connecting to a remote cluster. The configuration file has to be placed at `.github/telepresence-config/config.yml` so the action is able to find it an append it to the configuration directory in the GitHub runner.

Ideally this action will live in a workflow that can be run manually per repository and executed everytime users need to upgrade the version of Telepresence they are using or if they change the Telepresence configuration file at `.github/telepresence-config/config.yml`. The action has to be run in the main branch of the repository so that it caches the mentioned files and makes them available in further workflow executions in any branch, by doing this, Ambassador will be able to recognize service intercepts for your repository and correlate events appropiately. In addition to that, the action will cache the Telepresence binary in order to reduce the download time taken in workflow executions.

The cache entry key is created with the combination of the Telepresence version and the checksum of the user's configuration file (if provided) which means that if there is any change to the provided configuration file the action has to be run manually again. For more information about manually-run workflows see [this GitHub page](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow).


## Inputs
| name | required | default value | description |
| ----- | -------- | ----- | ----- |
| version | no | latest | The version of Telepresence to install |


## Usage

```yaml
name: Configuring telepresence
on: workflow_dispatch # Manualy triggered workflow
jobs:
  configuring:
    name: Telepresence setup
    runs-on: ubuntu-latest
    env:
      TELEPRESENCE_API_KEY: ${{ secrets.TELEPRESENCE_API_KEY }}
      KUBECONFIG_FILE: ${{ secrets.KUBECONFIG_FILE }}
      KUBECONFIG: /opt/kubeconfig
    steps:
      - name : Checkout
        uses: actions/checkout@v3
      - name: Create kubeconfig file
        run: |
          cat <<EOF > /opt/kubeconfig
          ${{ env.KUBECONFIG_FILE }}
          EOF
      - name: Congifuring Telepresence
        uses: datawire/telepresence-actions/configure@v0.4
        with:
          version: 2.5.8
```
