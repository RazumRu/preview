import { applyDecorators, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../guards/auth.guard'

export const OnlyForAuth = () => {
  return applyDecorators(
    // SetMetadata('roles', roles)
    UseGuards(AuthGuard)
  )
}
