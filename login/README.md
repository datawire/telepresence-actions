# Telepresence login action

The telepresence login action internally executes the `telepresence login` command and allows users to log into Ambassador by providing an API key. Running this action before the `intercept` action is required in order to create a [personal intercept](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#personal-intercept) otherwise you will be creating a [global intercept](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/?intercept=global#global-intercept). See [this guide](https://www.getambassador.io/docs/telepresence/latest/reference/client/login/#acquiring-an-api-key) for instructions on how to get an API key. 
If the provided API key is invalid or expired the action return an error.

It's a good practice for users to store their Telepresence API key as a Github Actions secret so that the contents are encrypted and masked out in the workflow's logs.

## Inputs
| name | required | default value |
| ----- | -------- | ----- |
| telepresence_api_key | ☑️  | |

## Post action

The telepresence login action includes a post action script that logs the user out when the job finishes so the user doesn't have to manually logout when terminating the workflow. Internally it executes the `telepresence logout` command.

## Usage

```yaml
  - name: Login
    uses: datawire/telepresence-actions/login@v0.3
    with:
      telepresence_api_key: ${{ secrets.TELEPRESENCE_API_KEY }}
```
