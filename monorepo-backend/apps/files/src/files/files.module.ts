import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FilesController } from './files.controller'
import { File, FileSchema } from './schemas/file.schema'
import { DefaultFileUploader } from './services/default-file-uploader'
import { FileSyncerQueue } from './services/file-syncer-queue'
import { FilesRepository } from './services/files.repository'
import { FilesService } from './services/files.service'

@Module({
  controllers: [FilesController],
  providers: [
    FilesService,
    DefaultFileUploader,
    FilesRepository,
    FileSyncerQueue
  ],
  imports: [
    FilesModule,
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])
  ]
})
export class FilesModule {}
