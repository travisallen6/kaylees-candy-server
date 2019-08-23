import { config } from "../common";
import { ApolloError } from "apollo-server-express";
import { jwt } from '../utils'
import { v4 as randomId } from 'uuid'

class Resolvers {
  public async authenticateUser(
    parent: {},
    args: { code: string },
    context: {},
    info: any
  ) {
    const isCodeValid = args.code === config.accessCode;
    if (!isCodeValid) {
      throw new ApolloError('Invalid code')
    }
    const id = randomId().replace(/-/g, '');
    const token = jwt.sign({ admin: false, id })
    return token;
  }

  // public async authenticateAdmin() {

  // }
}

const resolvers = new Resolvers();

export default {
  Query: {
    authenticateUser: resolvers.authenticateUser
  }
}