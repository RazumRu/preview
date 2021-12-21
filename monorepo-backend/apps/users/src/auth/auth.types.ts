export interface ICreatedAuthTokenData {
  jwt: string
  refresh: string
  refreshExpiredAt: number
  jwtExpiredAt: number
}

export interface IAuthSessionData {
  userId: string
  uuid: string
  expiredAt: number
}

export interface ICreatedAuthSessionData {
  sessionData: IAuthSessionData
  tokenData: ICreatedAuthTokenData
}
