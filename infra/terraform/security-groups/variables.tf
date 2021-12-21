variable "app" {
  type = object({
    name = string
    environment = string
  })
}

variable "vpc_id" {
  type = string
}
