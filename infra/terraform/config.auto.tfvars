app = {
  name = "passed-way"
  environment = "production"
  cert_arn = "cert_arn"
  api_domain = "api.example.ru"
}

services = [
  {
    name: "jewelry"
    cpu: 512
    memory: 1024
    port: 5000,
    health_check_path: "/jewelry/health/check",
    alb_path_pattern = "/jewelry/*"
    environments: [
      {
        name: "NODE_ENV",
        value: "production"
      }
    ]
  }
]
