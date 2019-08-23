import { readFileSync } from "fs";
import * as jwt from 'jsonwebtoken'
const autoBind = require('auto-bind');

interface SignOptions {
  algorithm?: string;
  keyid?: string;
  expiresIn?: string | number;
  notBefore?: string | number;
  audience?: string | string[];
  subject?: string;
  issuer?: string;
  jwtid?: string;
  noTimestamp?: boolean;
  header?: object;
  encoding?: string;
}

class JwtUtils {
  private readonly jwtOptions = {
    algorithm: 'RS256',
    expiresIn: '30d'
  };

  constructor() {
    autoBind(this);
  }

  private getPrivateKey() {
    return readFileSync('jwtrsa-private.key')
  }

  private getPublicKey() {
    return readFileSync('jwtrsa-public.pem')
  }

  public sign(
    payload: string | Buffer | object,
    options: SignOptions = {},
  ): string {
    const jwtPrivateKey = this.getPrivateKey()
    const combinedOptions = Object.assign(this.jwtOptions, options);
    const token = jwt.sign(payload, jwtPrivateKey, combinedOptions);
    return token;
  }

  public verify(token: string) {
    const publicKey = this.getPublicKey();
    return jwt.verify(token, publicKey)
  }
}

export default new JwtUtils();
