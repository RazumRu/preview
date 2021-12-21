terraform {
  required_providers {
    aws = {
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  access_key = var.aws_settings.access_key
  secret_key = var.aws_settings.secret_key
  region     = var.aws_settings.region
}