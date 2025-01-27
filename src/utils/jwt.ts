import jwt from 'jsonwebtoken'
import envConfig from '~/constants/config'

export const signToken = ({payload, privateKey = envConfig.jwtSecret as string , options = { algorithm: 'HS256' }}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) throw reject(error)

      resolve(token as string)
    })
  })
}