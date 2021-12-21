import { Test, TestingModule } from '@nestjs/testing'
import { createMock } from '@golevelup/ts-jest'
import { LeanDocument } from 'mongoose'
import { FileDocument } from '../schemas/file.schema'
import { DefaultFileUploader } from './default-file-uploader'
import { FileSyncerQueue } from './file-syncer-queue'
import { FilesRepository } from './files.repository'
import { FilesService } from './files.service'

describe(FilesService, () => {
  let service: FilesService

  const files: LeanDocument<FileDocument>[] = [
    {
      contentType: 'contentType',
      uuid: 'uuid',
      name: 'name',
      bucket: 'bucket',
      size: 500
    }
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: DefaultFileUploader,
          useValue: createMock<DefaultFileUploader>({
            async getUrl() {
              return 'url'
            },

            async getUploadURL() {
              return 'url'
            }
          })
        },
        {
          provide: FilesRepository,
          useValue: createMock<FilesRepository>({
            async getFiles() {
              return files
            }
          })
        },
        {
          provide: FileSyncerQueue,
          useValue: createMock<FileSyncerQueue>()
        }
      ]
    }).compile()

    service = module.get<FilesService>(FilesService)
  })

  describe('getUploadURL', () => {
    it('should get upload url', async () => {
      const filename = 'filename.jpg'
      const data = await service.getUploadURL({
        filename
      })

      expect(data.link).toBeString()
      expect(data.uuid).toBeString()
    })
  })

  describe('getFiles', () => {
    it('should get files', async () => {
      const data = await service.getFiles({
        uuids: []
      })

      expect(data).toBeArrayOfSize(files.length)
      expect(data[0].name).toEqual(files[0].name)
      expect(data[0].contentType).toEqual(files[0].contentType)
      expect(data[0].size).toEqual(files[0].size)
      expect(data[0].uuid).toEqual(files[0].uuid)
      expect(data[0].url).toBeString()
    })
  })
})
