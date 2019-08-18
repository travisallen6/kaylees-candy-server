import { readFileSync } from "fs";

const jwt = require('jsonwebtoken');
const autoBind = require('auto-bind');

interface SignOptions {
  /**
   * Signature algorithm. Could be one of these values :
   * - HS256:    HMAC using SHA-256 hash algorithm (default)
   * - HS384:    HMAC using SHA-384 hash algorithm
   * - HS512:    HMAC using SHA-512 hash algorithm
   * - RS256:    RSASSA using SHA-256 hash algorithm
   * - RS384:    RSASSA using SHA-384 hash algorithm
   * - RS512:    RSASSA using SHA-512 hash algorithm
   * - ES256:    ECDSA using P-256 curve and SHA-256 hash algorithm
   * - ES384:    ECDSA using P-384 curve and SHA-384 hash algorithm
   * - ES512:    ECDSA using P-521 curve and SHA-512 hash algorithm
   * - none:     No digital signature or MAC value included
   */
  algorithm?: string;
  keyid?: string;
  /** @member {string} - expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  expiresIn?: string | number;
  /** @member {string} - expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  notBefore?: string | number;
  audience?: string | string[];
  subject?: string;
  issuer?: string;
  jwtid?: string;
  noTimestamp?: boolean;
  header?: object;
  encoding?: string;
}

class CredentialService {
  private readonly jwtOptions = {
    algorithm: 'RS256',
    expiresIn: '1m',
    issuer: 'urn:kayleesCandy',
    audience: 'urn:kayleesCandy',
    subject: 'kayleesCandy:subject',
  };

  constructor() {
    autoBind(this);
  }

  private getPrivateKey() {
    return readFileSync('jwtrsa-private.key')
  }

  public sign(
    payload: string | Buffer | object,
    options: SignOptions = {},
  ): string {
    const jwtPrivateKey = this.getPrivateKey()
    const combinedOptions = Object.assign(options, this.jwtOptions);
    const token = jwt.sign(payload, jwtPrivateKey, combinedOptions);
    return token;
  }

}

export default new CredentialService();
