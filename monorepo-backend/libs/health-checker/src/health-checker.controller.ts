import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { HealthCheckResponseDto } from '@passed-way/health-checker/dto/health-check-response.dto'
import { HEALTH_STATUS } from '@passed-way/health-checker/health-checker.types'

@Controller('health')
@ApiTags('health')
export class HealthCheckerController {
  constructor() {
    //
  }

  @Get('check')
  @ApiOperation({
    description: 'Service health check'
  })
  public async check(): Promise<HealthCheckResponseDto> {
    return { status: HEALTH_STATUS.OK }
  }
}
