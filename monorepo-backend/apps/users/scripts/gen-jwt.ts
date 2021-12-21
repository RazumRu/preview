import { IAuthTokenData } from '@passed-way/auth-helper'
import jsonwebtoken from 'jsonwebtoken'

const run = async (args: string[]) => {
  const userId = args[0]
  const jwtKey = process.env.JWT_SECRET_KEY

  const jwtData: IAuthTokenData = {
    userId
  }

  if (!userId) {
    throw new Error('UserId is not passed. Pass it as the first argument')
  }

  if (!jwtKey) {
    throw new Error(
      'jwtKey is not passed. Pass it as the JWT_SECRET_KEY env variable'
    )
  }

  const jwt = jsonwebtoken.sign(jwtData, jwtKey)
  console.log(jwtKey)
  console.log(jwtData)
  console.log(jwt)
}

run(process.argv.slice(2)).catch((err) => {
  console.error(err)
  process.exit(-1)
})
