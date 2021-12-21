import * as bcrypt from 'bcrypt'
import { MongoClient } from 'mongodb'

const run = async (args: string[]) => {
  const email = args[0]
  const pass = args[1]
  const mongodbUrl = process.env.MONGODB_URL

  if (!email) {
    throw new Error('Email is not passed. Pass it as the first argument')
  }

  if (!pass) {
    throw new Error('Password is not passed. Pass it as the second argument')
  }

  if (!mongodbUrl) {
    throw new Error(
      'Mongodb url is not passed. Put the value into the MONGODB_URL env variable'
    )
  }

  const encryptPass = await bcrypt.hash(pass, 10)
  const client = new MongoClient(mongodbUrl)
  await client.connect()

  try {
    await client.db().collection('users').insertOne({
      email,
      password: encryptPass
    })

    console.log(`${email} created`)
  } finally {
    await client.close()
  }
}

run(process.argv.slice(2)).catch((err) => {
  console.error(err)
  process.exit(-1)
})
