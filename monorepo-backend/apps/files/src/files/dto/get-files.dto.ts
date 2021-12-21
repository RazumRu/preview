import { IsUUID } from 'class-validator'

export default class GetFilesDto {
  @IsUUID('4', { each: true })
  public uuids: string[]
}
