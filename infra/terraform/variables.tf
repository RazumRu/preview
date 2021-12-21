variable "aws_settings" {
  type = object({
    region = string
    access_key = string
    secret_key = string
  })
}

variable "app" {
  type = object({
    name = string
    environment = string
    cert_arn = string
    api_domain = string
  })
}

variable "services" {
  type = list(object({
    name = string
    cpu = number
    memory = number
    port = number
    health_check_path = string
    alb_path_pattern = string
    environments: list(object({
      name = string
      value = string
    }))
  }))
}

variable "secrets" {
  type = map(string)
}
