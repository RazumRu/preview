resource "aws_lb" "main" {
  name               = "${var.app.name}-api-alb-${var.app.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = var.alb_security_groups
  subnets            = var.subnets.*.id

  enable_deletion_protection = false

  tags = {
    Name        = "${var.app.name}-api-alb-${var.app.environment}"
    Environment = var.app.environment
  }
}

resource "aws_lb_target_group" "main" {
  count = length(var.services)

  name        = "${var.app.name}-${element(var.services.*.name, count.index)}-tg-${var.app.environment}"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    healthy_threshold   = "3"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "3"
    path                = element(var.services.*.health_check_path, count.index)
    unhealthy_threshold = "2"
  }

  tags = {
    Name        = "${var.app.name}-${element(var.services.*.name, count.index)}-tg-${var.app.environment}"
    Environment = var.app.environment
  }
}

# Redirect to https listener
resource "aws_alb_listener" "http" {
  load_balancer_arn = aws_lb.main.id
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = 443
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# Redirect traffic to target group
resource "aws_alb_listener" "https" {
  count = length(var.services)

  load_balancer_arn = aws_lb.main.id
  port              = 443
  protocol          = "HTTPS"

  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.app.cert_arn

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "Page Not Found"
      status_code  = "404"
    }
  }
}

resource "aws_lb_listener_rule" "static" {
  count = length(var.services)

  listener_arn = element(aws_alb_listener.https.*.arn, count.index)
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = element(aws_lb_target_group.main.*.arn, count.index)
  }

  condition {
    path_pattern {
      values = [element(var.services.*.alb_path_pattern, count.index)]
    }
  }

  condition {
    host_header {
      values = [var.app.api_domain]
    }
  }
}

output "aws_alb_target_group_arn" {
  value = aws_lb_target_group.main.*.arn
}