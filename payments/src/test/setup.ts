import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'
import jwt from 'jsonwebtoken'

declare global {
  var signin: (id?: string) => string[]
}

jest.mock('../nats-wrapper')

process.env.STRIPE_KEY = 'sk_test_51NobZsI0XqF9L8qyDG6tA7DIBUWc8MDs1rUuAEOWtiWcFBhqJBS4cOKk5809t2LKhAB8zBoVbF1HTjliPgcJJW1n00wbRiT7so'

let mongo: any
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf'
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop()
  }
  await mongoose.connection.close()
})

global.signin = (id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = { 
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'asdf@asdf.com'
  }
  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build session Object { jwt: MY_JWT }
  const session = { jwt: token }

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`]

}