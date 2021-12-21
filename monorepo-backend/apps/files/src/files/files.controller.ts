import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { FileDto } from './dto/file.dto'
import GetFilesDto from './dto/get-files.dto'
import GetUploadUrlDto from './dto/get-upload-url.dto'
import UploadLinkDto from './dto/upload-link.dto'
import { FilesService } from './services/files.service'

@Controller('/')
@ApiTags('/')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('/getUploadURL')
  @ApiOperation({
    description:
      'The client must use the PUT method to download the file to the received address.'
  })
  public async getUploadURL(
    @Query() data: GetUploadUrlDto
  ): Promise<UploadLinkDto> {
    return this.filesService.getUploadURL(data)
  }

  @Get('/getFiles')
  @ApiOperation({
    description:
      'Receives already uploaded files. Please be aware that syncing can take a certain amount of time'
  })
  public async getFiles(@Query() data: GetFilesDto): Promise<FileDto[]> {
    return this.filesService.getFiles(data)
  }
}
