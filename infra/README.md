# pw-infra

Infrastructure for Example project

## VM setup

1. [install docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-ru)
2. [Install docker-compose](https://docs.docker.com/compose/install/)
3. [Install yc](https://cloud.yandex.ru/docs/cli/operations/install-cli)
4. [Auth](https://cloud.yandex.ru/docs/cli/operations/authentication/user)
5. `yc container registry configure-docker`
6. create `.env` file in `/docker`

## Terraform

I use Terraform for AWS Fargate setup

## Docker

Also for example i made files for setup project via docker-compose