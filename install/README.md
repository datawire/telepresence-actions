# Telepresence install action

The Telepresence install action installs the Telepresence binary in the Github runner at a specific version (optional) so it is available for other steps of the workflow.

**Note**: It only supports Unix systems for now.

## Inputs

| name | required | default value |
| ----- | -------- | ----- |
| version | no | latest |

## Usage

```yaml
- name: Install Telepresence
  uses: datawire/telepresence-actions/install@v1.0
  with:
    version: 2.5.8
```
