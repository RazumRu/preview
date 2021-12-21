resource "aws_ecr_repository" "main" {
  count                = length(var.services)
  name                 = "${var.app.name}-${element(var.services.*.name, count.index)}-${var.app.environment}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}

resource "aws_ecr_lifecycle_policy" "main" {
  count = length(var.services)
  repository = element(aws_ecr_repository.main.*.name, count.index)

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "keep last 5 images"
      action       = {
        type = "expire"
      }
      selection     = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 5
      }
    }]
  })
}

output "aws_ecr_repository_url" {
  value = aws_ecr_repository.main[*].repository_url
}