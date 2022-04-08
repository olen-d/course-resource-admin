import * as jose from 'jose'

const verifyBearerToken = async (accessToken, publicKey) => {
  const jwtAlgorithm = import.meta.env.VITE_JWT_ALGORITHM
  const jwtIssuer = import.meta.env.VITE_JWT_ISSUER

  const ecPublicKey = await jose.importSPKI(publicKey, jwtAlgorithm)
  const result = await jose.jwtVerify(accessToken, ecPublicKey, { issuer: jwtIssuer })
  return result
}

export { verifyBearerToken }
