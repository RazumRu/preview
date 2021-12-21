import { Injectable } from '@nestjs/common'
import { LeanDocument } from 'mongoose'
import { v4 } from 'uuid'
import { FileDto } from '../dto/file.dto'
import GetFilesDto from '../dto/get-files.dto'
import GetUploadUrlDto from '../dto/get-upload-url.dto'
import UploadLinkDto from '../dto/upload-link.dto'
import { FileDocument } from '../schemas/file.schema'
import { DefaultFileUploader } from './default-file-uploader'
import { FileSyncerQueue } from './file-syncer-queue'
import { FilesRepository } from './files.repository'

@Injectable()
export class FilesService {
  constructor(
    private readonly defaultFileUploader: DefaultFileUploader,
    private readonly filesRepository: FilesRepository,
    private readonly fileSyncerQueue: FileSyncerQueue
  ) {
    //
  }

  private async prepareFile(
    file: LeanDocument<FileDocument>
  ): Promise<FileDto> {
    const fileUrl = await this.defaultFileUploader.getUrl(file.name)

    return {
      name: file.name,
      contentType: file.contentType,
      size: file.size,
      uuid: file.uuid,
      url: fileUrl
    }
  }

  public async getUploadURL(data: GetUploadUrlDto): Promise<UploadLinkDto> {
    const fileUuid = v4()
    const mimeType = data.filename.split('.').pop()
    const resultFilename = `${fileUuid}.${mimeType}`

    const uploadURL = await this.defaultFileUploader.getUploadURL(
      resultFilename
    )

    await this.fileSyncerQueue.addJob({
      name: resultFilename,
      uuid: fileUuid
    })

    return {
      link: uploadURL,
      uuid: fileUuid
    }
  }

  public async getFiles(data: GetFilesDto): Promise<FileDto[]> {
    const files = await this.filesRepository.getFiles(data.uuids)

    return Promise.all(files.map((f) => this.prepareFile(f)))
  }
}
