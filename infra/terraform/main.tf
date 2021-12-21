module "vpc" {
  source = "./vpc"
  app = var.app
}

module "security_groups" {
  source = "./security-groups"
  vpc_id = module.vpc.id
  app = var.app
}

module "ecr" {
  source = "./ecr"
  app = var.app
  services = var.services
}

/*module "secrets" {
  source = "./secrets"
  app = var.app
  secrets = var.secrets
}*/

module "alb" {
  source              = "./alb"
  app = var.app
  services = var.services
  vpc_id              = module.vpc.id
  subnets             = module.vpc.public_subnets
  alb_security_groups = [module.security_groups.alb]
}

module "ecs" {
  source = "./ecs"
  aws_settings = var.aws_settings
  app = var.app
  subnets = module.vpc.private_subnets
  ecs_service_security_groups = [module.security_groups.ecs_tasks]
  # container_secrets = module.secrets.secrets_map
  # container_secrets_arns = module.secrets.application_secrets_arn

  services = [for k, v in var.services : {
    name = v.name
    cpu = v.cpu
    memory = v.memory
    port = v.port
    environments = v.environments
    container_image = module.ecr.aws_ecr_repository_url[k]
  }]
  aws_alb_target_group_arn = module.alb.aws_alb_target_group_arn
}