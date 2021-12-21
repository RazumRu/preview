import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { LeanDocument, Model } from 'mongoose'
import { FileDocument, File } from '../schemas/file.schema'

@Injectable()
export class FilesRepository {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  public async createFile(data: File): Promise<FileDocument> {
    const createdData = await this.fileModel.create(data)
    return createdData
  }

  public async getFiles(
    uuids: string[]
  ): Promise<LeanDocument<FileDocument>[]> {
    return this.fileModel.find().where('uuid').in(uuids).lean().exec()
  }
}
