locals {
  cidr_block = "10.0.0.0/16"
  private_subnets = ["10.0.0.0/24", "10.0.32.0/24"]
  public_subnets = ["10.0.16.0/24", "10.0.48.0/24"]
  availability_zones  = ["eu-north-1a", "eu-north-1b"]
}

resource "aws_vpc" "main" {
  cidr_block           = local.cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.app.name}-vpc-${var.app.environment}"
    Environment = var.app.environment
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.app.name}-igw-${var.app.environment}"
    Environment = var.app.environment
  }
}

resource "aws_nat_gateway" "main" {
  count         = length(local.private_subnets)
  allocation_id = element(aws_eip.nat.*.id, count.index)
  subnet_id     = element(aws_subnet.public.*.id, count.index)
  depends_on    = [aws_internet_gateway.main]

  tags = {
    Name        = "${var.app.name}-nat-${var.app.environment}-${format("%03d", count.index+1)}"
    Environment = var.app.environment
  }
}

resource "aws_eip" "nat" {
  count = length(local.private_subnets)
  vpc = true

  tags = {
    Name        = "${var.app.name}-eip-${var.app.environment}-${format("%03d", count.index+1)}"
    Environment = var.app.environment
  }
}

resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = element(local.private_subnets, count.index)
  availability_zone = element(local.availability_zones, count.index)
  count             = length(local.private_subnets)

  tags = {
    Name        = "${var.app.name}-private-subnet-${var.app.environment}-${format("%03d", count.index+1)}"
    Environment = var.app.environment
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = element(local.public_subnets, count.index)
  availability_zone       = element(local.availability_zones, count.index)
  count                   = length(local.public_subnets)
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.app.name}-public-subnet-${var.app.environment}-${format("%03d", count.index+1)}"
    Environment = var.app.environment
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.app.name}-routing-table-public"
    Environment = var.app.environment
  }
}

resource "aws_route" "public" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.main.id
}

resource "aws_route_table" "private" {
  count  = length(local.private_subnets)
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.app.name}-routing-table-private-${format("%03d", count.index+1)}"
    Environment = var.app.environment
  }
}

resource "aws_route" "private" {
  count                  = length(compact(local.private_subnets))
  route_table_id         = element(aws_route_table.private.*.id, count.index)
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = element(aws_nat_gateway.main.*.id, count.index)
}

resource "aws_route_table_association" "private" {
  count          = length(local.private_subnets)
  subnet_id      = element(aws_subnet.private.*.id, count.index)
  route_table_id = element(aws_route_table.private.*.id, count.index)
}

resource "aws_route_table_association" "public" {
  count          = length(local.public_subnets)
  subnet_id      = element(aws_subnet.public.*.id, count.index)
  route_table_id = aws_route_table.public.id
}

resource "aws_flow_log" "main" {
  iam_role_arn    = aws_iam_role.vpc-flow-logs-role.arn
  log_destination = aws_cloudwatch_log_group.main.arn
  traffic_type    = "ALL"
  vpc_id          = aws_vpc.main.id
}

resource "aws_cloudwatch_log_group" "main" {
  name = "${var.app.name}-cloudwatch-log-group"
}

resource "aws_iam_role" "vpc-flow-logs-role" {
  name = "${var.app.name}-vpc-flow-logs-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "vpc-flow-logs.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "vpc-flow-logs-policy" {
  name = "${var.app.name}-vpc-flow-logs-policy"
  role = aws_iam_role.vpc-flow-logs-role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

output "id" {
  value = aws_vpc.main.id
}

output "public_subnets" {
  value = aws_subnet.public
}

output "private_subnets" {
  value = aws_subnet.private
}