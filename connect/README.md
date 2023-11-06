# Telepresence connect action

The telepresence connect action allows users to perform a `telepresence connect` command. It requires a `$KUBECONFIG` env var to point to a valid Kubernetes configuration file that contains information to connect to a remote cluster or a config file in `$HOME/.kube` as that's how `kubectl` searches for the information it needs to choose a cluster and communicate with the API server of a cluster. See [Organizing cluster access using kubeconfig files](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/).

It's a good practice for users to store their KUBECONFIG yaml files as a Github Actions secret so that the contents are encrypted and masked out in the workflow's logs.

## Inputs

| name | required | default value | description
| ----- | -------- | ----- | ------ |
| namespace |  no  | default | The namespace to connect to |

## Post action

The telepresence connect action includes a post action script that ends the connection when the job finishes.

## Usage

```yaml
name: Example workflow
on:
  push:
    branches-ignore:
    - 'main'
jobs:
  my-job:
    name: Example workflow to connect to a remote cluster
    runs-on: ubuntu-latest
    env:
      # Env var to instruct Telepresence where to find the kubeconfig file
      KUBECONFIG: /opt/kubeconfig
    steps:

      # Other previous steps to clone the repository and install the Telepresence binary...
      # ...

      # Create the /opt/kubeconfig file with the contents of the KUBECONFIG_FILE secret.
      - name: Create kubeconfig file 
        run: |
          cat <<EOF > /opt/kubeconfig
          ${{ secrets.KUBECONFIG_FILE }}
          EOF

      # Connect to a remote Kubernetes cluster
      - name: Connect to remote cluster
        uses: datawire/telepresence-actions/connect@v1.0
        with:
          namespace: emojivoto
      # Other steps ...
```
