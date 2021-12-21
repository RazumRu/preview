import { IsString } from 'class-validator'

export default class GetUploadUrlDto {
  @IsString()
  public filename: string
}
