variable "aws_settings" {
  type = object({
    region = string
  })
}

variable "app" {
  type = object({
    name = string
    environment = string
  })
}

/*variable "container_secrets_arns" {
  description = "ARN for secrets"
}

variable "container_secrets" {
  description = "The container secret environmnent variables"
  type        = list
}*/

variable "ecs_service_security_groups" {
  description = "Comma separated list of security groups"
}

variable "subnets" {
  description = "List of subnet IDs"
}

variable "aws_alb_target_group_arn" {
  description = "ARN of the alb target group"
  type = list
}

variable "services" {
  type = list(object({
    name = string
    cpu = number
    memory = number
    port = number
    environments: list(object({
      name = string
      value = string
    }))
    container_image = string
  }))
}