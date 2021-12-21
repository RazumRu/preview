import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as minio from 'minio'
import url, { URL } from 'url'
import { FileUploader } from './file-uploader'

@Injectable()
export class DefaultFileUploader extends FileUploader {
  private minioClient: minio.Client

  constructor(configService: ConfigService) {
    super(configService)
  }

  public getBucketName(): string {
    return this.configService.get('S3_BUCKET_NAME', '')
  }

  public async getUrl(name: string): Promise<string> {
    const endpoint = new URL(this.configService.get('S3_ENDPOINT', ''))

    return url.format({
      protocol: endpoint.protocol,
      hostname: endpoint.hostname,
      port: endpoint.port,
      pathname: `${this.getBucketName()}/${name}`
    })
  }

  protected async getClient(): Promise<minio.Client> {
    if (!this.minioClient) {
      const endpoint = new URL(this.configService.get('S3_ENDPOINT', ''))

      this.minioClient = new minio.Client({
        endPoint: endpoint.hostname,
        region: this.configService.get('S3_REGION', ''),
        port: +endpoint.port,
        accessKey: this.configService.get('S3_ACCESS_KEY', ''),
        secretKey: this.configService.get('S3_SECRET_KEY', ''),
        useSSL: endpoint.protocol === 'https:'
      })
    }

    return this.minioClient
  }
}
