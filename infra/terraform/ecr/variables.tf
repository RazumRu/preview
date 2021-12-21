variable "app" {
  type = object({
    name = string
    environment = string
  })
}

variable "services" {
  type = list(object({
    name = string
  }))
}
