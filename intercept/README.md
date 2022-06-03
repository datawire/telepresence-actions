# Telepresence intercept action

Telepresence intercept allows you to intercept only some of the traffic to a service running in a remote cluster while not interfering with the rest of the traffic. This allows you to share a cluster with others on your team without interfering with their work. See [this page](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/?intercept=personal#personal-intercept) for more information.


## Inputs

| name | required | default value | description
| ----- | -------- | ----- | ------ |
| namespace |  no | default | The namespace of the service to intercept |
| service_name |  ☑️  | | The name of the service to intercept |
| service_port |  ☑️  | | The port to intercept |
| http_header |  no | x-telepresence-intercept-id=service-intercepted | Only intercept traffic that matches this "HTTP2_HEADER=REGEXP" specifier |
| env_file |  no | | Emit the remote environment to an env file in Docker Compose format |
| ingress_host |  no | ambassador.ambassador | This value will be used as the ingress hostname |
| ingress_port |  no | 80 | This value will be used as the ingress port |
| ingress_tls |  no | | This flag will determine if TLS is used, and will default to false. |
| ingress_l5 |  no | ambassador.ambassador | This flag will default to the ingress-host value. |
| print_logs |  no | | This flag will determine if telepresence logs are printed out to the job's output and exported as an artifact. |

## Post action

The telepresence intercept action includes a post action script that internally executes `telepresence leave` to terminate the connection to the remote service.


## Usage

```yaml
- name: Intercept remote service
  uses: datawire/telepresence-actions/intercept@v1.0
  with:
    service_name: voting
    service_port: 8080
    namespace: emojivoto
    http_header: "x-telepresence-intercept-id=service-intercepted"
```
