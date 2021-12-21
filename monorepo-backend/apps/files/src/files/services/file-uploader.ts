import { ConfigService } from '@nestjs/config'
import * as minio from 'minio'
import { Readable as ReadableStream } from 'stream'
import { IFileInfo } from '../files.types'

export abstract class FileUploader {
  protected constructor(protected readonly configService: ConfigService) {}

  public abstract getBucketName(): string
  public abstract getUrl(name: string): Promise<string>
  protected abstract getClient(): Promise<minio.Client>

  public async putFile(
    name: string,
    data: ReadableStream | Buffer | string,
    metadata?: any
  ) {
    const client = await this.getClient()

    await client.putObject(this.getBucketName(), name, data, metadata)
  }

  public async getUploadURL(name: string): Promise<string> {
    const client = await this.getClient()
    const uploadLinkExpiry = +this.configService.get(
      'S3_UPLOAD_LINK_EXPIRY',
      300
    )

    return client.presignedPutObject(
      this.getBucketName(),
      name,
      uploadLinkExpiry
    )
  }

  public async getFileInfo(name: string): Promise<IFileInfo> {
    const client = await this.getClient()
    const info = await client.statObject(this.getBucketName(), name)

    return {
      size: info.size,
      contentType: info.metaData['content-type'],
      filename: name,
      bucket: this.getBucketName()
    }
  }
}
