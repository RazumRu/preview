variable "app" {
  type = object({
    name = string
    environment = string
  })
}

variable "secrets" {
  type = map(string)
}
