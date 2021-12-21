import { Module } from '@nestjs/common'
import { HealthCheckerController } from '@passed-way/health-checker/health-checker.controller'

@Module({
  controllers: [HealthCheckerController],
  providers: [],
  exports: []
})
export class HealthCheckerModule {}
