import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@passed-way/logger'
import { IFileSyncJob } from '../files.types'
import { DefaultFileUploader } from './default-file-uploader'
import { FilesRepository } from './files.repository'
import Bull, { Job } from 'bull'

@Injectable()
export class FileSyncerQueue {
  private readonly queue: Bull.Queue

  constructor(
    private readonly configService: ConfigService,
    private readonly defaultFileUploader: DefaultFileUploader,
    private readonly filesRepository: FilesRepository,
    private readonly logger: Logger
  ) {
    this.queue = new Bull('file-sync', configService.get('REDIS_URL'))
  }

  async onModuleInit() {
    await this.initConsumer()
  }

  public async addJob(data: IFileSyncJob) {
    const delay =
      (this.configService.get('S3_UPLOAD_LINK_EXPIRY') || 300) * 1000
    const attempts = 5
    const resultDelay = delay / attempts

    await this.queue.add(data, {
      delay: resultDelay,
      attempts,
      removeOnFail: false,
      removeOnComplete: true,
      backoff: {
        type: 'fixed',
        delay: resultDelay
      }
    })
  }

  public async initConsumer() {
    this.logger.log(`initConsumer`)

    this.queue.process(async (job: Job<IFileSyncJob>) => {
      this.logger.log(`Process file`, job.data)

      try {
        const fileInfo = await this.defaultFileUploader.getFileInfo(
          job.data.name
        )

        await this.filesRepository.createFile({
          contentType: fileInfo.contentType,
          name: fileInfo.filename,
          bucket: fileInfo.bucket,
          size: fileInfo.size,
          uuid: job.data.uuid
        })
      } catch (e) {
        const err = e as Error
        this.logger.log(`Error file processing: ${err.message}`, job.data)
        throw err
      }
    })
  }
}
