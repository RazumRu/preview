import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const TokenData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.authTokenData
  }
)
