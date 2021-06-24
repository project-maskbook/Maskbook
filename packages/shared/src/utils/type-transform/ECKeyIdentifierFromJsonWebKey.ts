import { compressSecp256k1Key, CryptoKeyToJsonWebKey, ECKeyIdentifier, EC_JsonWebKey } from '../..'

export function ECKeyIdentifierFromJsonWebKey(key: EC_JsonWebKey) {
    const x = compressSecp256k1Key(key, 'public')
    return new ECKeyIdentifier('secp256k1', x)
}
/**
 * @deprecated We're using JWK instead of CryptoKey
 */
export async function ECKeyIdentifierFromCryptoKey(key: CryptoKey) {
    return ECKeyIdentifierFromJsonWebKey(await CryptoKeyToJsonWebKey(key))
}
