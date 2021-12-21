import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class FileDto {
  @ApiProperty({
    example: 'image/jpeg'
  })
  public contentType?: string

  @IsUUID()
  public uuid: string

  public name: string

  public url: string

  @ApiProperty({
    example: 'Size in bytes'
  })
  public size?: number
}
