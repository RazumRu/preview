import { IsUrl } from 'class-validator'

export default class UploadLinkDto {
  @IsUrl()
  public link: string

  public uuid: string
}
