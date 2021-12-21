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
    health_check_path = string
    alb_path_pattern = string
  }))
}

variable "alb_security_groups" {
  description = "Comma separated list of security groups"
}

variable "subnets" {
  description = "Comma separated list of subnet IDs"
}

variable "vpc_id" {
  description = "VPC ID"
}
