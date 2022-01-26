import jwt from 'jsonwebtoken'

const verifyBearerToken = (accessToken, publicKey) => {
  const jwtAlgorithm = process.env.VUE_APP_JWT_ALGORITHM
  const jwtIssuer = process.env.VUE_APP_JWT_ISSUER

  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, publicKey, { algorithms: [jwtAlgorithm], issuer: jwtIssuer }, (error, decoded) => {
      if (error) {
        reject(error)
      } else {
        resolve(decoded)
      }
    })
  })
}

export { verifyBearerToken }
