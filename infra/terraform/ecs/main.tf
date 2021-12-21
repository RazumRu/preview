resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.app.name}-ecsTaskExecutionRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role" "ecs_task_role" {
  name = "${var.app.name}-ecsTaskRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "ecs-task-execution-role-policy-attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_cloudwatch_log_group" "main" {
  name = "/ecs/${var.app.name}-task-${var.app.environment}"

  tags = {
    Name        = "${var.app.name}-task-${var.app.environment}"
    Environment = var.app.environment
  }
}

resource "aws_ecs_task_definition" "main" {
  count = length(var.services)
  family                   = "${var.app.name}-${element(var.services.*.name, count.index)}-task-${var.app.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = element(var.services.*.cpu, count.index)
  memory                   = element(var.services.*.memory, count.index)
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  container_definitions = jsonencode([{
    name        = "${var.app.name}-${element(var.services.*.name, count.index)}-container-${var.app.environment}"
    image       = element(var.services.*.container_image, count.index)
    essential   = true
    environment = element(var.services.*.environments, count.index)
    portMappings = [{
      protocol      = "tcp"
      containerPort = element(var.services.*.port, count.index)
      hostPort      = element(var.services.*.port, count.index)
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.main.name
        awslogs-stream-prefix = "ecs"
        awslogs-region        = var.aws_settings.region
      }
    }
  }])

  tags = {
    Name        = "${var.app.name}-${element(var.services.*.name, count.index)}-task-${var.app.environment}"
    Environment = var.app.environment
  }
}

resource "aws_ecs_cluster" "main" {
  name = "${var.app.name}-cluster-${var.app.environment}"
  tags = {
    Name        = "${var.app.name}-cluster-${var.app.environment}"
    Environment = var.app.environment
  }
}

resource "aws_ecs_service" "main" {
  count = length(var.services)

  name                               = "${var.app.name}-${element(var.services.*.name, count.index)}-service-${var.app.environment}"
  cluster                            = aws_ecs_cluster.main.id
  task_definition                    = element(aws_ecs_task_definition.main.*.arn, count.index)
  desired_count                      = 1
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200
  health_check_grace_period_seconds  = 60
  launch_type                        = "FARGATE"
  scheduling_strategy                = "REPLICA"

  network_configuration {
    security_groups  = var.ecs_service_security_groups
    subnets          = var.subnets.*.id
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = element(var.aws_alb_target_group_arn.*, count.index)
    container_name   = "${var.app.name}-${element(var.services.*.name, count.index)}-container-${var.app.environment}"
    container_port   = element(var.services.*.port, count.index)
  }

  # we ignore task_definition changes as the revision changes on deploy
  # of a new version of the application
  # desired_count is ignored as it can change due to autoscaling policy
  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }
}

resource "aws_appautoscaling_target" "ecs_target" {
  count = length(var.services)

  max_capacity       = 4
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.main.name}/${element(aws_ecs_service.main.*.name, count.index)}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_policy_memory" {
  count = length(var.services)

  name               = "memory-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = element(aws_appautoscaling_target.ecs_target.*.resource_id, count.index)
  scalable_dimension = element(aws_appautoscaling_target.ecs_target.*.scalable_dimension, count.index)
  service_namespace  = element(aws_appautoscaling_target.ecs_target.*.service_namespace, count.index)

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }

    target_value       = 80
    scale_in_cooldown  = 300
    scale_out_cooldown = 300
  }
}

resource "aws_appautoscaling_policy" "ecs_policy_cpu" {
  count = length(var.services)

  name               = "cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = element(aws_appautoscaling_target.ecs_target.*.resource_id, count.index)
  scalable_dimension = element(aws_appautoscaling_target.ecs_target.*.scalable_dimension, count.index)
  service_namespace  = element(aws_appautoscaling_target.ecs_target.*.service_namespace, count.index)


  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value       = 60
    scale_in_cooldown  = 300
    scale_out_cooldown = 300
  }
}