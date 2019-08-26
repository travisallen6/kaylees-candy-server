import { config } from "../common";
import { ApolloError, UserInputError } from "apollo-server-express";
import { IContext } from '../types'
import { jwt } from '../utils'
import { v4 as randomId } from 'uuid'
import autoBind = require("auto-bind");

class Resolvers {
  constructor() {
    autoBind(this)
  }

  private generateJwt(id: string) {
    const token = jwt.sign({ admin: false, id })
    return token;
  }

  public async checkCode(
    parent: {},
    args: { code: string },
    context: IContext,
    info: any
  ) {
    return args.code === config.accessCode;

  }

  public async login(
    parent: {},
    args: { userInfo: { code: string, firstName: string, lastName: string, email: string, phone?: string } },
    { models: { User } }: IContext,
    info: any
  ) {
    const { code, firstName, lastName, email, phone } = args.userInfo;
    const { accessCode } = config;
    if (code !== accessCode) {
      throw new UserInputError('Incorrect code')
    }
    const user = await User.findOne({ email });
    if (!user) {
      const newUser = await User.create({ firstName, lastName, email, phone })
      return { token: this.generateJwt(newUser._id) }
    }
    return { token: this.generateJwt(user._id) }
  }

  // public async authenticateAdmin() {

  // }
}

const resolvers = new Resolvers();

export default {
  Query: {
    checkCode: resolvers.checkCode
  },
  Mutation: {
    login: resolvers.login
  }
}