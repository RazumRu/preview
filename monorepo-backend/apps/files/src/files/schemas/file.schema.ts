import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type FileDocument = File & Document

@Schema()
export class File {
  @Prop()
  public contentType: string

  @Prop({
    required: true,
    unique: true
  })
  public uuid: string

  @Prop({
    required: true,
    unique: true
  })
  public name: string

  @Prop({
    required: true,
    index: true,
    type: String
  })
  public bucket: string

  @Prop()
  public size: number
}

export const FileSchema = SchemaFactory.createForClass(File)
