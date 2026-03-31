{{/*
Common security context for all pods
*/}}
{{- define "devopsflow.podSecurityContext" -}}
securityContext:
  runAsNonRoot: true
  runAsUser: 1001
  seccompProfile:
    type: RuntimeDefault
{{- end -}}

{{/*
Common container security context
*/}}
{{- define "devopsflow.containerSecurityContext" -}}
securityContext:
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities:
    drop: ["ALL"]
{{- end -}}

{{/*
Common resource limits
*/}}
{{- define "devopsflow.resources" -}}
resources:
  limits:
    cpu: "300m"
    memory: "256Mi"
  requests:
    cpu: "100m"
    memory: "128Mi"
{{- end -}}
