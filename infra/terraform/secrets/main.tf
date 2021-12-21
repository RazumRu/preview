# This file creates secrets in the AWS Secret Manager
# Note that this does not contain any actual secret values
# make sure to not commit any secret values to git!
# you could put them in secrets.tfvars which is in .gitignore


resource "aws_secretsmanager_secret" "application_secrets" {
  count = length(var.secrets)
  name  = "${var.app.name}-application-secrets-${var.app.environment}-${element(keys(var.secrets), count.index)}"
}


resource "aws_secretsmanager_secret_version" "application_secrets_values" {
  count         = length(var.secrets)
  secret_id     = element(aws_secretsmanager_secret.application_secrets.*.id, count.index)
  secret_string = element(values(var.secrets), count.index)
}

locals {
  secrets = zipmap(keys(var.secrets), aws_secretsmanager_secret_version.application_secrets_values.*.arn)

  secretMap = [for secretKey in keys(var.secrets) : {
    name      = secretKey
    valueFrom = lookup(local.secrets, secretKey)
  }

  ]
}

output "application_secrets_arn" {
  value = aws_secretsmanager_secret_version.application_secrets_values.*.arn
}

output "secrets_map" {
  value = local.secretMap
}
